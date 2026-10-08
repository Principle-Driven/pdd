#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

status=0

for principle_file in docs/principles/pdd-*.md; do
  principle_id="$(sed -n 's/^Token: //p' "$principle_file" | head -1)"
  principle_version="$(sed -n 's/^Version: //p' "$principle_file" | head -1)"

  if [[ -z "$principle_id" || -z "$principle_version" ]]; then
    echo "Missing Token or Version: $principle_file"
    status=1
    continue
  fi

done

current_token() {
  requested_id="$1"

  for principle_file in docs/principles/pdd-*.md; do
    principle_id="$(sed -n 's/^Token: //p' "$principle_file" | head -1)"
    principle_version="$(sed -n 's/^Version: //p' "$principle_file" | head -1)"

    if [[ "$principle_id" == "$requested_id" ]]; then
      printf '%s@%s' "$principle_id" "$principle_version"
      return
    fi
  done
}

while IFS=: read -r file line token; do
  principle_id="${token%@*}"
  expected="$(current_token "$principle_id")"

  if [[ -z "$expected" ]]; then
    echo "$file:$line: unknown principle token $token"
    status=1
  elif [[ "$token" != "$expected" ]]; then
    echo "$file:$line: stale principle token $token; expected $expected"
    status=1
  fi
done < <(rg --line-number --only-matching \
  --glob '!docs/principles/**' \
  --glob '!scripts/check-principles.sh' \
  'PDD-[0-9]+@v[0-9]+' . || true)

while IFS=: read -r file line _; do
  source_line="$(sed -n "${line}p" "$file")"
  if [[ "$source_line" != *"PDD-06@v"* ]]; then
    echo "$file:$line: ACCEPTED-RISK marker has no PDD-06 version citation"
    status=1
  fi
done < <(rg --line-number 'ACCEPTED-RISK:' \
  --glob '!docs/principles/**' \
  --glob '!scripts/check-principles.sh' . || true)

exit "$status"
