# VPWA_Stefun_Stefanko
Semester project based on IRC (Slack application)

## Instalation 
1. ### Download the repository 
```sh
git clone https://github.com/LadislavStefun/VPWA_Stefun_Stefanko.git
```
2. ### Go inside the app directory
```sh
cd .\VPWA_Stefun_Stefanko\app\
```
3. ### Install the dependencies
```sh
npm install
```
4. ### Add enviroment variables
 In  **\VPWA_Stefun_Stefanko\app\backend\\**  add .env file with following variables : 
 ```sh
TZ=
PORT=
HOST=
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development

DB_CONNECTION=[sqlite|pg]
SESSION_DRIVER=cookie

#default is FRONTEND_URL=http://localhost:9000,http://127.0.0.1:9000
FRONTEND_URL=
 ```

In **\VPWA_Stefun_Stefanko\app\frontend\\** add .env file with following variables : 
```sh
VITE_API_URL=
VITE_API_WS_URL=
```
6. ### Run the app in presentation mode
Run the application **!!! In directory \VPWA_Stefun_Stefanko\app !!!** trough these options :   
Run concurrently with backend and frontend in presentation mode
```sh
npm run presentation
```

Run PWA mode 
```sh
npm run pwa
```

Run frontend only 
```sh
npm run dev:web
```
Run backend only - **!!! .env file in backend is neccessary !!!**
```sh
npm run dev:api
```
5. ### Connect to ip shown in terminal
   
