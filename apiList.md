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


## POST APIS
1. Create Post API - POST /api/posts

2. Get Feed (Lightweight) - GET /api/posts

3. User Posts - GET /api/users/:userId/posts

4. Add Comment - POST /api/posts/:postId/comments

5. Get Comments (Paginated ✅) - GET /api/posts/:postId/comments?page=1&limit=10

6. Like a Post - POST /api/posts/:postId/like
Optional:
DELETE /api/posts/:postId/like   (unlike)
request:{
  likeCount:
}

7. Repost - POST /api/posts/:postId/repost

8. Get Single Post Details -GET /api/posts/:postId

