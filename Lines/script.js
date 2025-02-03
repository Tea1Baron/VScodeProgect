// Функция создания матрицы
function createMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const randomNumber = Math.floor(Math.random() * 5) + 1;
            row.push(randomNumber);
        }
        matrix.push(row);
    }
    return matrix;
}

// Функция отображения матрицы
function displayMatrix(matrix) {
    const table = document.getElementById('matrixTable');
    table.innerHTML = ''; // Очищаем таблицу
    matrix.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, colIndex) => {
            const td = document.createElement('td');
            td.dataset.row = rowIndex;
            td.dataset.col = colIndex;
            if (cell !== 0) {
                const circle = document.createElement('div');
                circle.classList.add('circle');
                circle.style.backgroundColor = getColor(cell);
                td.appendChild(circle);
            }
            td.addEventListener('click', onCellClick); // Добавляем обработчик клика
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

// Функция получения цвета
function getColor(number) {
    const colors = {
        1: 'red',
        2: 'green',
        3: 'blue',
        4: 'purple',
        5: 'brown',
        0: 'white'
    };
    return colors[number];
}

// Проверка на соседство ячеек
function areAdjacent(row1, col1, row2, col2) {
    return (
        (Math.abs(row1 - row2) === 1 && col1 === col2) ||
        (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
}

// Проверка и замена 3 и более одинаковых чисел в строках и столбцах
function checkAndReplaceMatches(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Проверяем строки
    for (let i = 0; i < rows; i++) {
        let count = 1;
        for (let j = 1; j < cols; j++) {
            if (matrix[i][j] === matrix[i][j - 1] && matrix[i][j] !== 0) {
                count++;
                if (count >= 3 && (j === cols - 1 || matrix[i][j] !== matrix[i][j + 1])) {
                    for (let k = 0; k < count; k++) {
                        matrix[i][j - k] = 0;
                    }
                }
            } else {
                count = 1;
            }
        }
    }

    // Проверяем столбцы
    for (let j = 0; j < cols; j++) {
        let count = 1;
        for (let i = 1; i < rows; i++) {
            if (matrix[i][j] === matrix[i - 1][j] && matrix[i][j] !== 0) {
                count++;
                if (count >= 3 && (i === rows - 1 || matrix[i][j] !== matrix[i + 1][j])) {
                    for (let k = 0; k < count; k++) {
                        matrix[i - k][j] = 0;
                    }
                }
            } else {
                count = 1;
            }
        }
    }
    displayMatrix(matrix);
}

// Обработчик клика по ячейке
let selectedCell = null;
function onCellClick(event) {
    const clickedCell = event.target.closest('td');
    const row = parseInt(clickedCell.dataset.row, 10);
    const col = parseInt(clickedCell.dataset.col, 10);

    if (!selectedCell) {
        selectedCell = clickedCell;
        selectedCell.style.backgroundColor = '#ddd'; // Выделяем ячейку
    } else {
        const selectedRow = parseInt(selectedCell.dataset.row, 10);
        const selectedCol = parseInt(selectedCell.dataset.col, 10);

        if (areAdjacent(selectedRow, selectedCol, row, col)) {
            const temp = matrix9x9[selectedRow][selectedCol];
            matrix9x9[selectedRow][selectedCol] = matrix9x9[row][col];
            matrix9x9[row][col] = temp;
            checkAndReplaceMatches(matrix9x9);
        } else {
            alert("Вы можете менять местами только соседние ячейки.");
        }
        selectedCell.style.backgroundColor = '';
        selectedCell = null;
    }
}

// Инициализация матрицы и отображение
let matrix9x9 = createMatrix(9, 9);
displayMatrix(matrix9x9);
