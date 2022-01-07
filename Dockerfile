FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN apt-get update

RUN apt-get install r-base -y

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

RUN R -e "install.packages('dplyr', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('tidyr', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('rjson', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('jsonlite', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('broom', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('anytime', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('stats', repos='https://cran.rstudio.com/')"

COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]