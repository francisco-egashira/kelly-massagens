# Single-photo carousel fix

Fixed `ProfessionalCard` so a professional with exactly one photo starts at track index `0`.

Before:
- 0 photos -> index 0
- 1 photo  -> index 1 (invalid/off-screen)
- 2+ photos -> index 1 (correct because the carousel prepends a clone)

After:
- 0 or 1 photo -> index 0
- 2+ photos -> index 1

The same rule is used when the professional/photos change.
