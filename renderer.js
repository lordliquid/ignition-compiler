function loadData(newLabel) {
  let previous = localStorage.getItem(newLabel);
  console.log('Loading Previous Data', newLabel, previous);
  return previous;
}

var pathFinders = document.getElementById('path-finders');
var textInputs = document.getElementById('text-inputs');

function handleValue(event, newLabel) {
  let element = event.target;
  if (element.files) {
    console.log('Saving Files', newLabel, element.files);
    element.setAttribute('value', element.files[0].path);
    element.setAttribute('content', element.files[0].path);
    localStorage.setItem(newLabel, element.files);
    return;
  }
  if (element.value) {
    console.log('Saving Text', newLabel, element.value);
    element.setAttribute('value', element.value);
    element.setAttribute('content', element.value);
    localStorage.setItem(newLabel, element.value);
    return;
  }
}

function newPathFinder(newLabel, elementToAppendTo) {
  var previous = loadData(newLabel);
  var input = document.createElement('INPUT');
  var label = document.createElement('h2');
  input.setAttribute('type', 'file');
  input.setAttribute('class', newLabel);
  label.setAttribute('htmlFor', newLabel);
  elementToAppendTo.appendChild(label);
  elementToAppendTo.appendChild(input);
  if (previous) {
    console.log('Loaded Data:', newLabel, previous);
    input.setAttribute('files', previous);
  }
  input.addEventListener('change', e => handleValue(e, newLabel));
  label.innerHTML = newLabel;
  return input;
}

function newInput(newLabel, elementToAppendTo, type) {
  var previous = loadData(newLabel);

  var input = document.createElement('INPUT');
  var label = document.createElement('h2');
  type = type || 'text';
  input.setAttribute('type', type);
  input.setAttribute('class', newLabel);
  input.setAttribute('id', type);
  label.setAttribute('htmlFor', newLabel);
  if (previous) {
    console.log('Loaded Data:', newLabel, previous);
    input.setAttribute('value', previous);
  }
  input.addEventListener('change', e => handleValue(e, newLabel));
  elementToAppendTo.appendChild(label);
  elementToAppendTo.appendChild(input);
  label.innerHTML = newLabel;
  return input;
}

function newButton(newLabel, elementToAppendTo) {
  var button = document.createElement('button');
  elementToAppendTo.appendChild(button);
  button.setAttribute('name', newLabel);
  button.setAttribute('text', newLabel);
  button.setAttribute('value', newLabel);
  button.innerHTML = newLabel;
  return button;
}

var signer = newPathFinder('Signer', pathFinders);
var modl = newPathFinder('Modl', pathFinders);
var keyStore = newPathFinder('Key-Store', pathFinders);
var certificate = newPathFinder('Certificate', pathFinders);

var alias = newInput('Alias', textInputs, 'text');
var aliasPassword = newInput('Alias Password', textInputs, 'password');
var keyStorePassword = newInput('Key Store Password', textInputs, 'password');
var compileButton = newButton('Compile', textInputs);

function handleCompile() {
  console.log(signer.files[0].path);
  let path = `java -jar ${signer.files[0].path} -keystore=${
    keyStore.files[0].path
  } -keystore-pwd=${keyStorePassword.value} -alias=${alias.value} -alias-pwd=${
    aliasPassword.value
  } -chain=${certificate.files[0].path} -module-in=${
    modl.files[0].path
  } -module-out=${modl.files[0].path}`;

  const exec = require('child_process').exec;
  exec(path, (error, stdout, stderr) => {
    if (error instanceof Error) {
      console.error('stderr', stderr);
      throw error;
    }
    var success = document.createElement('p');
    textInputs.appendChild(success);
    success.innerHTML = 'Successfully Signed: ' + modl.files[0].path;
  });
}

compileButton.addEventListener('click', handleCompile);
