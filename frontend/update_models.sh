
if ! [ -x "$(command -v ng-openapi-gen)" ]; then
  if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
      sudo npm i -g ng-openapi-gen
  else
    npm i -g ng-openapi-gen
  fi
fi

if ! [ -x "$(command -v rimraf)" ]; then
  if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
      sudo npm i -g rimraf
  else
    npm i -g rimraf
  fi
fi

#rimraf ./src/app/@core/api
ng-openapi-gen -i http://localhost:3000/api-json -o ./src/app/core/api
