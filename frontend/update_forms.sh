
if ! [ -x "$(command -v ngx-form-generator)" ]; then
  if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
      sudo npm install @verizonconnect/ngx-form-generator --save-dev
  else
    npm install @verizonconnect/ngx-form-generator --save-dev
  fi
fi

if ! [ -x "$(command -v rimraf)" ]; then
  if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
      sudo npm i -g rimraf
  else
    npm i -g rimraf
  fi
fi

ngx-form-generator -i http://localhost:3000/api-json -o ./src/app/core/api-forms
