[![Netlify Status](https://api.netlify.com/api/v1/badges/a85b9a22-32b1-479a-a00a-26277493613b/deploy-status)](https://app.netlify.com/sites/react-ts-redux-realworld-example-app/deploys)
![Pipeline](https://github.com/angelguzmaning/ts-redux-react-realworld-example-app/actions/workflows/pipeline.yml/badge.svg)

# ts-redux-react-realworld-example-app
React codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

# Getting started (original documentation)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template. In the project directory, you can run:

- `npm install`: Installs required dependencies
- `npm start`: Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. Note: This project will run the app even if linting fails.
- `npm test`: Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
- `npm run build`: Builds the app for production to the `build` folder.<br /> It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed! See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Building Docker image and testing K8s Locally
1. Build Docker image
    
    ```
    docker build -t sample:dev .
    ```
    
2. Run it to see that it works OK 
    
    ```bash
    docker run \
        -it \
        --rm \
        -v ${PWD}:/src \
        -v /node_modules \
        -p 3001:3000 \
        -e CHOKIDAR_USEPOLLING=true \
        sample:dev
    ```
    
3. Create a repository called `realworld` in gcloud artifact repository
4. Configure docker to use that registry
    
    ```
    gcloud auth configure-docker us-east1-docker.pkg.dev
    ```
    
5. Tag the docker image with that registry
    
    ```bash
    docker tag sample:dev us-east1-docker.pkg.dev/devops-practices-and-tools/realworld/react-app:dev
    ```
    
6. Push the image to the registry
    
    ```bash
    docker push us-east1-docker.pkg.dev/devops-practices-and-tools/realworld/react-app:dev
    ```
    
7. Login to gcloud
    
    ```
    gcloud auth application-default login
    ```
    
8. Make sure that you haven't set the `GOOGLE_APPLICATION_CREDENTIALS` in your .rc file. 
    
    <aside>
    💡 OR YOU'LL BE IN LOTS OF PAIN
    </aside>
    
9. Start minikube (this creates a cluster)
    
    ```bash
    minikube start
    ```
    
10. Add on [https://minikube.sigs.k8s.io/docs/handbook/addons/gcp-auth/](https://minikube.sigs.k8s.io/docs/handbook/addons/gcp-auth/)
    
    ```
    minikube addons enable gcp-auth
    ```
    
11. Create a new deployment using that docker image
    
    ```bash
    kubectl create deployment sonja --image=us-east1-docker.pkg.dev/devops-practices-and-tools/realworld/react-app:dev
    ```


# Details (original documentation)
The root of the application is the `src/components/App` component. The App component uses react-router's HashRouter to display the different pages. Each page is represented by a [function component](https://reactjs.org/docs/components-and-props.html). 

Some components include a `.slice` file that contains the definition of its state and reducers, which might also be used by other components. These slice files follow the [Redux Toolkit](https://redux-toolkit.js.org/) guidelines. Components connect to the state by using [custom hooks](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).

This application is built following (as much as practicable) functional programming principles:
* Immutable Data
* No classes
* No let or var
* Use of monads (Option, Result)
* No side effects

The code avoids runtime type-related errors by using Typescript and decoders for data coming from the API.

Some components include a `.test` file that contains unit tests. This project enforces a 100% code coverage.

This project uses prettier and eslint to enforce a consistent code syntax.

## Folder structure
* `src/components` Contains all the functional components.
* `src/components/Pages` Contains the components used by the router as pages.
* `src/state` Contains redux related code.
* `src/services` Contains the code that interacts with external systems (API requests).
* `src/types` Contains type definitions alongside the code related to those types.
* `src/config` Contains configuration files.
