function newPathFinder(newLabel, elementToAppendTo) {
    let previous = loadData(newLabel);

    let div = document.createElement('div');
    let input = document.createElement('INPUT');
    let label = document.createElement('h2');

    div.setAttribute('class', 'container');
    input.setAttribute('type', 'file');
    input.setAttribute('class', newLabel);
    label.setAttribute('htmlFor', newLabel);

    elementToAppendTo.appendChild(div);
    div.appendChild(label);
    div.appendChild(input);

    if (previous) {
        let path = previous;
        path = path.split(`\\`);
        console.log("Previous Path:", path);
        console.log("Previous Path:", previous);
        let existLabel = document.createElement('p');
        div.appendChild(existLabel);
        existLabel.setAttribute('class', 'existing');
        existLabel.innerHTML = path[path.length - 1];
    }

    input.setAttribute('path', previous || '');
    input.setAttribute('content', previous || '');
    input.addEventListener('change', e => handleValue(e, newLabel, div));
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
        input.setAttribute('value', previous);
        input.setAttribute('content', previous);
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
function loadData(attr) {
    return localStorage.getItem(attr);
}

function saveData(attr, value) {
    localStorage.setItem(attr, value);
}

function handleValue(element, newLabel, div) {
    element = element.target;

    if (div) {
        saveData(newLabel, element.files[0].path);
        let path = loadData(newLabel);
        // path = path.split(`\\`);
        let existLabel = document.createElement('p');
        div.appendChild(existLabel);
        element.setAttribute('path', path);
        existLabel.setAttribute('class', 'existing');
        existLabel.innerHTML = path[path.length - 1];
        return;
    } else {
        element.setAttribute('value', element.value);
        element.setAttribute('path', path);
        saveData(newLabel, element.value);
        return;
    }
}

function execute(config, element) {
    const message = document.getElementById('message');
    let outname = config.path.split('-unsigned').join('-signed');
    console.log(outname);
    const path = `java -jar ${config.signer} -keystore=${
        config.keystore
    } -alias=${config.alias} -keystore-pwd=${
        config.keystorePassword
    } -alias-pwd=${config.aliasPassword} -chain=${
        config.certificate
    } -module-in=${config.path} -module-out=${outname}`;
    const exec = require('child_process').exec;
    exec(path, (error, stdout, stderr) => {
        if (error instanceof Error) {
            alert('[   Error Signing, ' + error + '   ]');
            throw error;
        }
        message.innerHTML = '[   Successfully Signed!   ]';
    });
}

function exit() {
    window.close();
}

function getPath(element) {
    return element.getAttribute('path');
}

function getValue(element) {
    return element.getAttribute('value');
}

function main() {
    console.log("Main Called");
    var exitButton = document.getElementById('exit');
    var textInputs = document.getElementById('text-inputs');
    var pathFinders = document.getElementById('path-finders');

    var signer = newPathFinder('Signer', pathFinders);
    var modl = newPathFinder('Modl', pathFinders);
    var keyStore = newPathFinder('Key-Store', pathFinders);
    var certificate = newPathFinder('Certificate', pathFinders);

    var alias = newInput('Alias', textInputs, 'text');
    var aliasPassword = newInput('Alias Password', textInputs, 'password');
    var keyStorePassword = newInput(
        'Key Store Password',
        textInputs,
        'password'
    );

    var compileButton = newButton('Compile', textInputs);
    exitButton.addEventListener('click', exit);
    compileButton.addEventListener('click', () =>
        execute(
            {
                signer: getPath(signer),
                keystore: getPath(keyStore),
                keystorePassword: getValue(keyStorePassword),
                aliasPassword: getValue(aliasPassword),
                alias: getValue(alias),
                path: getPath(modl),
                modl: getPath(modl),
                certificate: getPath(certificate)
            },
            textInputs
        )
    );
}

main();
