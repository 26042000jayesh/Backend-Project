# Each instruction in this file creates a new layer

# This means we are building the image of our application extending the official NodeJs image. The version of node is 20.3.1, hence,
# node:20.3.1.
FROM node:20.3.1 as base

# Now, to run the rest of our commands we have to set our working directory. Here ‘/app’ is the path relative to which everything is done when this docker image is used to create the container in another user's computer.
WORKDIR /app

# To get our application running, we need dependencies. To install these dependencies we need a package.json file. The command below copies both package.json files and package-lock.json files into the working directory.
COPY package*.json ./

# This step tells us in which port inside our container this application will be accessible. This doesn’t make the container accessible from the host.
EXPOSE 5500

# Creating the image of our application in the development environment from our base image.
FROM base as dev

# Setting node application environment is ‘development’.
ENV NODE_ENV = development

# installing the dependencies into the container. It creates node modules in our working directory.
RUN npm install

# copying the source code of Application into the container dir
COPY . ./

# command to run within the container
CMD ["npm", "run", "dev"]