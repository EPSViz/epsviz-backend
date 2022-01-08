FROM r-base:4.1.2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
    
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

RUN R -e "install.packages('dplyr', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('tidyr', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('rjson', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('jsonlite', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('broom', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('anytime', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('fansi', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('pkgconfig', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('purrr', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('cli', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('crayon', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('utf8', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('ellipsis', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('generics', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('glue', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('lifecycle', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('magrittr', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('R6', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('rlang', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('tibble', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('tidyselect', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('vctrs', repos='https://cran.rstudio.com/')"
RUN R -e "install.packages('pillar', repos='https://cran.rstudio.com/')"


COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]