let score = 0;
let gifUrl = 'meme.gif'; // Замените на URL вашего GIF файла
let matrix9x9 = createMatrix(9, 9); // Инициализация матрицы

// Функция обновления счёта
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = `Очки: ${score}`;
}

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
        1: '#FFFF00',   /* Ярко-красный */
        2: '#0000FF',   /* Ярко-зеленый */
        3: '#FF0000',   /* Ярко-синий */
        4: '#008000',    /* Ярко-фиолетовый */
        5: '#0072f5',  /* Ярко-оранжевый */
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

// Функция опускания шаров и добавления новых
function updateBoard(matrix) {
    let hasChanges;
    do {
        hasChanges = false;
        const rows = matrix.length;
        const cols = matrix[0].length;

        // Опускаем шары вниз
        for (let j = 0; j < cols; j++) {
            for (let i = rows - 1; i > 0; i--) {
                if (matrix[i][j] === 0) {
                    for (let k = i - 1; k >= 0; k--) {
                        if (matrix[k][j] !== 0) {
                            matrix[i][j] = matrix[k][j];
                            matrix[k][j] = 0;
                            hasChanges = true;
                            break;
                        }
                    }
                }
            }
        }

        // Добавляем новые шары сверху
        for (let j = 0; j < cols; j++) {
            if (matrix[0][j] === 0) {
                matrix[0][j] = Math.floor(Math.random() * 5) + 1;
                hasChanges = true;
            }
        }
    } while (hasChanges);
    displayMatrix(matrix);
}

// Функция для замены ячеек на GIF
// Функция для замены ячеек на GIF
async function replaceWithGif(matrix, row, col) {
    return new Promise((resolve) => {
        const table = document.getElementById('matrixTable');
        const td = table.querySelector(`td[data-row="${row}"][data-col="${col}"]`); // Находим ячейку

        if (!td) {
            console.warn(`Cell at row ${row}, col ${col} not found.`);
            resolve();
            return;
        }

        const originalContent = td.innerHTML; // Сохраняем исходное содержимое ячейки

        // Создаем элемент img для GIF
        const gifImg = document.createElement('img');
        gifImg.src = gifUrl;
        gifImg.classList.add('gif-animation');
        td.innerHTML = ''; // Очищаем ячейку
        td.appendChild(gifImg);  // Добавляем GIF в ячейку

        // Ждем один кадр, чтобы браузер отобразил GIF
        requestAnimationFrame(() => {
            resolve({ td, originalContent, gifImg });
        });
    });
}

// Функция для восстановления ячейки
async function restoreCell(cellData) {
    return new Promise((resolve) => {
        if (cellData && cellData.td && cellData.gifImg) {
            // Добавляем класс fade-out к GIF
            cellData.gifImg.classList.add('fade-out');

            // Ждем окончания анимации исчезновения
            setTimeout(() => {
                cellData.td.innerHTML = cellData.originalContent;
                resolve();
            }, 300); // Время должно совпадать с transition в CSS (0.3s = 300ms)
        } else {
            resolve();
        }
    });
}

// Модифицированная функция checkAndReplaceMatches
async function checkAndReplaceMatches(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let removedBalls = 0;
    let matchesFound = false;
    const cellsToRestore = []; // Массив данных для восстановления ячеек

    // Проверка строк
    for (let i = 0; i < rows; i++) {
        let count = 1;
        for (let j = 1; j < cols; j++) {
            if (matrix[i][j] === matrix[i][j - 1] && matrix[i][j] !== 0) {
                count++;
                if (count >= 3 && (j === cols - 1 || matrix[i][j] !== matrix[i][j + 1])) {
                    matchesFound = true;
                    for (let k = 0; k < count; k++) {
                        const currentRow = i;
                        const currentCol = j - k;

                        // Заменяем ячейку на GIF и сохраняем данные для восстановления
                        const cellData = await replaceWithGif(matrix, currentRow, currentCol);
                        if(cellData) {
                           cellsToRestore.push(cellData);
                        }

                        if (matrix[currentRow][currentCol] !== 0) removedBalls++;
                        matrix[currentRow][currentCol] = 0;
                    }
                    count = 1;
                }
            } else {
                count = 1;
            }
        }
    }

    // Проверка столбцов
    for (let j = 0; j < cols; j++) {
        let count = 1;
        for (let i = 1; i < rows; i++) {
            if (matrix[i][j] === matrix[i - 1][j] && matrix[i][j] !== 0) {
                count++;
                if (count >= 3 && (i === rows - 1 || matrix[i][j] !== matrix[i + 1][j])) {
                    matchesFound = true;
                    for (let k = 0; k < count; k++) {
                        const currentRow = i - k;
                        const currentCol = j;

                        // Заменяем ячейку на GIF и сохраняем данные для восстановления
                        const cellData = await replaceWithGif(matrix, currentRow, currentCol);
                         if(cellData) {
                           cellsToRestore.push(cellData);
                        }

                        if (matrix[currentRow][currentCol] !== 0) removedBalls++;
                        matrix[currentRow][currentCol] = 0;
                    }
                    count = 1;
                }
            } else {
                count = 1;
            }
        }
    }

    updateScore(removedBalls * 100);
    updateBoard(matrix);

    // Ждем 700мс (1000ms - 300ms анимации), затем восстанавливаем ячейки
    await new Promise(resolve => setTimeout(resolve, 700));

    for (const cellData of cellsToRestore) {
        await restoreCell(cellData);
    }

    updateBoard(matrix);

    if (matchesFound) {
        checkAndReplaceMatches(matrix);
    }
}

// Обработчик клика по ячейке
let selectedCell = null;

function animateCells(cell1, cell2, direction) {
    const row1 = parseInt(cell1.dataset.row, 10);
    const col1 = parseInt(cell1.dataset.col, 10);
    const row2 = parseInt(cell2.dataset.row, 10);
    const col2 = parseInt(cell2.dataset.col, 10);

    const circle1 = cell1.querySelector('.circle');
    const circle2 = cell2.querySelector('.circle');

    // Добавляем классы для анимации сжатия
    circle1.classList.add('shrink');
    circle2.classList.add('shrink');

    // Ждем окончания анимации сжатия и начинаем перемещение
    setTimeout(() => {
        // Получаем цвет шаров
        const color1 = circle1.style.backgroundColor;
        const color2 = circle2.style.backgroundColor;

        // Обновляем цвета шаров *перед* перемещением
        circle1.style.backgroundColor = color2;
        circle2.style.backgroundColor = color1;

        // Обмен значениями в матрице
        const temp = matrix9x9[row1][col1];
        matrix9x9[row1][col1] = matrix9x9[row2][col2];
        matrix9x9[row2][col2] = temp;

        // Добавляем классы для перемещения и расширения
        cell1.classList.add(`move-${direction}`);
        cell2.classList.add(`move-${direction}`);
        circle1.classList.remove('shrink');
        circle2.classList.remove('shrink');
        circle1.classList.add('expand');
        circle2.classList.add('expand');

        // Ждем окончания анимации перемещения и расширения и удаляем классы
        setTimeout(() => {
            cell1.classList.remove(`move-${direction}`);
            cell2.classList.remove(`move-${direction}`);
            circle1.classList.remove('expand');
            circle2.classList.remove('expand');

            // Используем requestAnimationFrame для более плавной анимации и сброса стилей
            requestAnimationFrame(() => {
                circle1.style.transform = 'translate(-50%, -50%)';
                circle2.style.transform = 'translate(-50%, -50%)';
                // Проверяем наличие совпадений
                checkAndReplaceMatches(matrix9x9);
            });
        }, 300); // Длительность анимации перемещения и расширения
    }, 150); // Длительность анимации сжатия
}

function onCellClick(event) {
    console.log("Клик зарегистрирован."); // Отладочное сообщение

    const clickedCell = event.target.closest('td');
    console.log("Кликнутая ячейка:", clickedCell); // Отладочное сообщение

    if (!clickedCell) {
        console.warn("Клик был вне ячейки.");
        return;
    }

    const row = parseInt(clickedCell.dataset.row, 10);
    const col = parseInt(clickedCell.dataset.col, 10);
    console.log("Координаты ячейки:", row, col); // Отладочное сообщение

    if (!selectedCell) {
        console.log("Выбрана новая ячейка:", clickedCell); // Отладочное сообщение
        selectedCell = clickedCell;
        selectedCell.classList.add('selected');
    } else {
        console.log("Уже выбрана ячейка:", selectedCell); // Отладочное сообщение
        const selectedRow = parseInt(selectedCell.dataset.row, 10);
        const selectedCol = parseInt(selectedCell.dataset.col, 10);

        if (areAdjacent(selectedRow, selectedCol, row, col)) {
            console.log("Ячейки соседние, начинаем анимацию."); // Отладочное сообщение
            let direction;
            if (row < selectedRow) {
                direction = 'down';
            } else if (row > selectedRow) {
                direction = 'up';
            } else if (col < selectedCol) {
                direction = 'right';
            } else {
                direction = 'left';
            }

            animateCells(clickedCell, selectedCell, direction);

        } else {
            console.log("Ячейки не соседние."); // Отладочное сообщение
            alert("Вы можете менять местами только соседние ячейки.");
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = null;
        }

        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = null;
    }
}

// Инициализация матрицы и отображение
document.body.insertAdjacentHTML('beforeend', '<h2 id="score">Очки: 0</h2>');
displayMatrix(matrix9x9);
checkAndReplaceMatches(matrix9x9);

// Переключатель темы
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme')
    themeToggle.textContent = 'Светлая тема'
}

// Переключатель темы
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme)
    themeToggle.textContent = currentTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'
});