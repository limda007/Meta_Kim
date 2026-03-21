# HEARTBEAT.md - meta-librarian

Default heartbeat policy:

- If there is no explicit scheduled work, respond with `HEARTBEAT_OK`.
- Do not create autonomous tasks or self-assign missions by default.
- Only act proactively after the deployment owner adds concrete heartbeat tasks below.

## Deployment Tasks

- None by default.
