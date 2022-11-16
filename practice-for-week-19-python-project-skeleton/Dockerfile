# Start with the python:3.9 image
FROM python:3.9

# Set the following enviroment variables
#
ENV REACT_APP_BASE_URL=https://disco-ord.herokuapp.com/
ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=true

# Set the directory for upcoming commands to /var/www
WORKDIR /var/www
# Copy all the files from your repo to the working directory
COPY . .
# Copy the built react app (it's built for us) from the
# /react-app/build/ directory into your flasks app/static directory
COPY /react-app/build/* app/static/
# Run the next two python install commands with PIP
# install -r requirements.txt
# install psycopg2
RUN pip install -r requirements.txt
RUN pip install psycopg2
# Start the flask environment by setting our
# closing command to gunicorn app:app
CMD gunicorn app:app
