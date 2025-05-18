# Coding pattern preferences. 

- Always prefer simple Solutions.

- Avoid duplication of code whenever possible, which means checking for other areas of the codebase that might already have similar code and functionality.

- write code that takes into account hte different environments: dev and prod

- You are carful to only make changes that are requested or you are confident about or changes are well understood and related to the change being requested. 

- When fixing and issue or bug, do not introduce a new pattern or technology without first exhasting all options for existing implementation. And if you finally do this, make sure to remove the od implemntation afterwards, so we don't have dubplicate logic. 

- Keep the codebase vey clean and organized. 

- Avoid writing scripts in files if possible, especially if the script is likely only to be run once. 

- Avoid having new files over 500 lines of code. Refactor at that point. 

- Mocking data is only needed for tests, never moc data for dev or prod. 

- Never overwrite my .env file without asking and confirming.
