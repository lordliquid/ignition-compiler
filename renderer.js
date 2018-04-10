var pathFinders = document.getElementById('path-finders');
var textInputs = document.getElementById('text-inputs');

function loadData(attr) {
  return localStorage.getItem(attr);
}

function saveData(attr, value) {
  localStorage.setItem(attr, value);
}

function handleValue(element = event.target, newLabel, cover) {
  // let element = event.target;
  console.log(element);
  if (element.files) {
    cover.setAttribute(
      'style',
      'color: transparent; background-color: transparent'
    );
    saveData(newLabel, 'path', element.files[0].path);
    saveData(newLabel, 'name', element.files[0].name);
    return;
  }
  if (element.value) {
    element.setAttribute('value', element.value);
    saveData(newLabel, 'value', element.value);
    return;
  }
}

function newPathFinder(newLabel, elementToAppendTo) {
  let previous = loadData(newLabel);

  let div = document.createElement('div');
  let input = document.createElement('INPUT');
  let label = document.createElement('h2');
  let existLabel = document.createElement('p');

  div.setAttribute('class', 'container');
  input.setAttribute('type', 'file');
  input.setAttribute('class', newLabel);
  label.setAttribute('htmlFor', newLabel);

  elementToAppendTo.appendChild(div);
  div.appendChild(label);
  div.appendChild(input);
  div.appendChild(existLabel);

  existLabel.setAttribute('class', 'existing');
  input.setAttribute('path', previous || '');
  input.addEventListener('change', e => handleValue(e, newLabel, existLabel));
  existLabel.innerHTML = previous;
  label.innerHTML = newLabel;
  return input;
}

function newInput(newLabel, elementToAppendTo, type) {
  var previous = loadData(newLabel);
  var input = document.createElement('INPUT');
  var label = document.createElement('h2');
  type = type || 'text';
  input.setAttribute('id', type);
  input.setAttribute('type', type);
  input.setAttribute('class', newLabel);
  label.setAttribute('htmlFor', newLabel);
  if (previous) {
    console.log('Loaded Data:', newLabel, previous);
    input.setAttribute('value', previous.value);
    input.setAttribute('content', previous.value);
  }
  elementToAppendTo.appendChild(label);
  elementToAppendTo.appendChild(input);
  input.addEventListener('change', e => handleValue(e, newLabel));
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
  let path = `java -jar ${signer.getAttribute('path')} -keystore=${
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
