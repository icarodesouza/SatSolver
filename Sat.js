/**
 * This file should be placed at the node_modules sub-directory of the directory where you're
 * executing it.
 *
 * Written by Ícaro de Souza e Julia de La Vega
 */
exports.solve = function(fileName) {
    let formula = readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    console.log(result)
    return result // two fields: isSat and satisfyingAssignment
}

// Receives the current assignment and produces the next one
// Pega o atual e muda o organização de 0 e 1 para modificar os verdadeiros e falsos
function nextAssignment(variables) {
    parar = false
    for(let i = variables.length - 1; i >= 0 && parar == false ; i--) {
        let ArrayAux = variables[i]
        if (ArrayAux == 0) {
            variables[i] = 1
            parar = true
        } else
            variables[i] = 0
    }
    return variables
}

function doSolve(clauses, assignment) {
    let isSat = false
    let count = 0
    let variables = [assignment]
    let aux
    let z = 0
    let clausulaValida = false
    let contagemClausulaValida = 0
    for (i = 0; i < assignment; i ++) {
        variables[i] = 0
    }
    while ((!isSat) && count <= Math.pow(2, assignment)) {
        for (i = 0; i < clauses.length; i++) {
            for (j = 0; j < clauses[i].length && clausulaValida == false; j++){
                aux = parseInt(clauses[i])
                z = aux[i].charAt(j)
                if (z != 0 && z > 0 && variables[z - 1] == 1){
                    clausulaValida = true
                    contagemClausulaValida = contagemClausulaValida + 1
                } else if (z != 0 && z > 0 && variables [z - 1] == 0){
                    clausulaValida = false
                } else if (z != 0 && z < 0 && variables [z - 1] == 1){
                    clausulaValida = false
                } else if (z != 0 && z < 0 && variables [z - 1] == 0){
                    clausulaValida = true
                }
            }

        }
        if (contagemClausulaValida == clauses.length + 1){
            isSat = true
        }
        // does this assignment satisfy the formula? If so, make isSat true.

        // if not, get the next assignment and try again.
        assignment = nextAssignment(variables)
    }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment
    }
    return result
}

function readFormula(fileName) {
    // To read the file, it is possible to use the 'fs' module.
    // Use function readFileSync and not readFile.
    // First read the lines of text of the file and only afterward use the auxiliary functions.
    var fs = require('fs')
    var data = fs.readFileSync(fileName).toString()
    let text = data.split ('\n')// = ...  //  an array containing lines of text extracted from the file.
    let clauses = readClauses(text)
    let variables = readVariables(clauses)

    // In the following line, text is passed as an argument so that the function
    // is able to extract the problem specification.
    let specOk = checkProblemSpecification(text, clauses, variables)

    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }
    return result
}
function readClauses(text) {
    let clausulas = ""
    for (i = 0; i < text.length; i++) {
        if (text[i].charAt('0') == 'p' || text[i].charAt('0') == 'c') {
            // Não altera porque c são comentários e p é o problema proposto, então a unica coisa que conta para ler as clausulas são as linhas que possuem nada no início
        } else {
            clausulas = clausulas + text[i]
        }
    }
    let clausulasAux
    clausulasAux = clausulas.split(" 0")
    clausulasAux.pop()
    return clausulasAux
}
function readVariables(clauses) {
    let count = 0
    let aux = ""
    for(i = 0; i < clauses.length; i++){
        for(j = 0; j < clauses[i].length; j++) {

            //Vê todas as variáveis e vai comparando com o auxiliar para achar a maior delas, que vai ser a quantidade de variáveis
            if((clauses[i].charAt(j + 1) == ' ' || clauses[i].charAt(j + 1) == '') && (clauses[i].charAt(j) <= '9' && clauses[i].charAt(j) >= '0' )){
                aux =  aux + clauses[i].charAt(j);
                aux = parseInt(aux)
                if(aux >= count){
                    count = aux
                }
                aux = "";

                //Ultima variável
            } else if (clauses[i].charAt(j) <= '9' && clauses[i].charAt(j) >= '0' ){
                aux = aux + clauses[i].charAt(j)
                if(aux >= count){
                    count = aux
                }
            }
        }
    }
    return count
}
function checkProblemSpecification (text, variables, clauses) {
    let clausesCount
    let variablesCount = ""
    let findProblem = false
    let achouVariavel = false
    let excederArray = false
    for (i = 0; i < text.length; i++) {

        //procura a linha que possui o problema em questão
        if(text[i].charAt(0) == 'p'){
            findProblem = true
            for (j = 0; j < text[i].length && achouVariavel == false; j++){

                //Procura a quantidade de variáveis pulando tudo que vem escrito antes ("cnf") e considera a possibilidade de existirem x dígitos
                if (text[i].charAt(j) >= '0' && text[i].charAt(j) <= '9'){
                    variablesCount = variablesCount + text[i].charAt(j)
                    if (text[i].charAt(j + 1) == ' '){
                        achouVariavel = true
                        k = j + 2
                    }
                }
            }

            //Procura a quantidade de clausulas e considera a possibilidade de existirem x dígitos
            for (k; k < text[i].length && excederArray == false; k++) {
                clausesCount = clausesCount + text[i].charAt(k);
                if(k + 1 == text[i].length){
                    excederArray = true;
                }
            }
        }
    }

//Transforma valores de string para inteiro para poder estabelecer a comparação
    clausesCount = parseInt(clausesCount);
    variablesCount = parseInt(variablesCount);

//Compara os valores que estão no proposição do problema com as que são realmente colocadas
    if (clauses.length == clausesCount && variables == variablesCount && findProblem == true) {
        resultado = true;
    }else if (findProblem == false){
        resultado = false;
    } else {
        resultado = false;
    }

    return resultado;
}