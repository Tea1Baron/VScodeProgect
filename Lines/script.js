// Создание матрицы 9x9 с случайными числами от 1 до 5
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

// Функция для отображения матрицы в виде таблицы
function displayMatrix(matrix) {
    const table = document.getElementById('matrixTable');
    table.innerHTML = ''; // Очищаем таблицу
    matrix.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

// Инициализация матрицы и отображение
let matrix9x9 = createMatrix(9, 9);
displayMatrix(matrix9x9);

// Функция для проверки, что координаты находятся рядом
function areAdjacent(row1, col1, row2, col2) {
    return (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2);
}

// Функция для замены местами двух чисел в матрице
function swapValues() {
    const row1 = parseInt(document.getElementById('row1').value) - 1;
    const col1 = parseInt(document.getElementById('col1').value) - 1;
    const row2 = parseInt(document.getElementById('row2').value) - 1;
    const col2 = parseInt(document.getElementById('col2').value) - 1;

    // Проверка на корректность введённых данных
    if (
        row1 < 0 || row1 >= 9 || col1 < 0 || col1 >= 9 ||
        row2 < 0 || row2 >= 9 || col2 < 0 || col2 >= 9
    ) {
        alert("Введите корректные позиции (от 1 до 9 для строк и столбцов).");
        return;
    }

    // Проверка на соседство ячеек
    if (!areAdjacent(row1, col1, row2, col2)) {
        alert("Вы можете менять местами только соседние ячейки (по горизонтали или вертикали).");
        return;
    }

    // Меняем местами элементы в матрице
    const temp = matrix9x9[row1][col1];
    matrix9x9[row1][col1] = matrix9x9[row2][col2];
    matrix9x9[row2][col2] = temp;

    // Обновляем отображение матрицы
    displayMatrix(matrix9x9);
}
