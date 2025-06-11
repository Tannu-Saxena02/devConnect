# DevTinder APIS

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## ConnectionRequestRouter
- POST /request/send/status/:userId      status=>ignored,interested
- POST /request/review/status/:userId    status=>accepted,rejected

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Get you the profiles of others users on platform

Status- ignore,interested,accepted,rejected

