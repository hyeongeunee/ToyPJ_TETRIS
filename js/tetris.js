//DOM
const playground = document.querySelector(".playground > ul");

//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500;
let downInterval;
let tmpMovingItem;

const BLOCKS = {
    tree : [
        [[2,1], [0,1], [1,0], [1,1]],
        [],
        [],
        [],
    ]
}

const movingItem = {
    type : "tree",
    direction : 0,
    top : 0,
    left : 3,
}

init();

//처음 게임을 실행
//functions
function init(){
    // 값만 따오는 것이기 때문에 tmpMovingItem 은 변경 x >> 값을 복사
    tmpMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }
    renderBlocks();
}

function prependNewLine(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}
function renderBlocks(){
    //변수에 바로 접근할 수 있도록 선언.
    const { type, direction, top, left } = tmpMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach((moving) =>{
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].forEach(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving");
        } else {
            tmpMovingItem = { ... movingItem }
            //콜스택 에러방지
            setTimeout(()=>{
                renderBlocks()
            }, 0)
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
//target 을 한 번 더 체크할 수 있는 함수
function checkEmpty(target){
    if(!target){
        return false;
    }
    return true;
}

function moveBlock(moveType, amount){
    tmpMovingItem[moveType] += amount;
    renderBlocks();
}

//event handling
document.addEventListener("keydown", (e)=>{
    switch (e.keyCode){
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        default :
            break;
    }
})