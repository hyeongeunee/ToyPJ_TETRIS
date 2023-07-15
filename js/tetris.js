import BLOCKS from "./block.js"

//DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button")
//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500;
let downInterval;
let tmpMovingItem;

const movingItem = {
    type : "",
    direction : 2,
    top : 0,
    left : 0,
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
    generateNewBlock();
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

function renderBlocks(moveType=""){
    //변수에 바로 접근할 수 있도록 선언.
    const { type, direction, top, left } = tmpMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach((moving) =>{
        moving.classList.remove(type, "moving");
    })
    // forEach 대신 some 사용 > 원하는 시점에 멈출 수 있게
    BLOCKS[type][direction].some(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving");
        } else {
            tmpMovingItem = { ... movingItem }
            if(moveType === 'retry'){
                clearInterval(downInterval);
                showGameOverText();
            }
            //콜스택 에러방지
            setTimeout(()=>{
                renderBlocks('retry');
                if(moveType === "top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach((moving) => {
        moving.classList.remove("moving");
        moving.classList.add("seized")
    })
    checkMatch()
}
function checkMatch(){

    const childNodes = playground.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine();
            score ++;
            scoreDisplay.innerText = score;
        }
    })

    generateNewBlock();
}

function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top', 1)
    }, duration)

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    
    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tmpMovingItem = {...movingItem};
    renderBlocks();
}

//target 을 한 번 더 체크할 수 있는 함수
function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}

function moveBlock(moveType, amount){
    tmpMovingItem[moveType] += amount;
    renderBlocks(moveType)
}

function chageDirection(){
    const direction = tmpMovingItem.direction;
    direction === 3 ? tmpMovingItem.direction = 0 : tmpMovingItem.direction += 1;
    renderBlocks()
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock("top", 1)
    }, 10)
}

function showGameOverText(){
    gameText.style.display="flex";
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
        case 38:
            chageDirection();
            break;
        case 32:
            dropBlock();
            break;
        default :
            break;
    }
})

restartButton.addEventListener("click", ()=>{
    playground.innerHTML = "";
    gameText.style.display = "none";
    init();
})