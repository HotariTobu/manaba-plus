const isIncludes = (arr, target) => arr.some(el => target.includes(el));
const returnClass = ["dropped"]
const changeClass = ["newCourseCard","courseTitle","courseitemdetail","course-card-status","courselink-state","course-card-status-child"]
const changeClass0 = ["newCourseCard"]//末尾の数字が入れ子になってる階層に対応
const changeClass1 = ["courseTitle","courseitemdetail","course-card-status","courselink-state"]
const changeClass2 = ["course-card-status-child"]
//ドラッグ開始イベントを定義
function handleDragStart(e){
    e.target.classList.add("dragging");

    //ドロップ効果の設定
    e.dataTransfer.effectAllowed = "move";
    
    //転送するデータの設定
    //const {id} = e.target;
    const data = {id:e.target.id,parentId:e.target.parentNode.id}
    e.dataTransfer.setData("application/json", JSON.stringify(data));
};

//ドラッグ終了イベントを定義
function handleDragEnd(e){e.target.classList.remove("dragging")};

//itemsにドラッグイベントを定義する
export  function registerDragEvent(item){
    item.draggable = "true";
    item.addEventListener("dragstart",handleDragStart,false);
    item.addEventListener("dragend",handleDragEnd,false);
}

export  function registerDragEventArray(items){
    for(let item of items ){
        registerDragEvent(item);
    }
}
export function registerDragEventDict(itemsDict){
    for(let key in itemsDict ){
        registerDragEvent(itemsDict[key]);
    }
}



//要素が重なったときのイベントを定義する
function handleDragEnter(e){
    if (isIncludes([...e.target.classList],returnClass)){
        return;
    }
    //console.log(e.target)
    e.target.classList.add("over");

    //背景色を変える場合は以下のステータスを追加
    if ([...e.target.classList].includes("courseCardFrame")){
        e.target.classList.add('overBackgroundChange');
    }
};

//要素が重なっている最中のイベントを定義する
function handleDragOver(e){
    //ブラウザ既定の処理を上書き
    e.preventDefault();
    if (isIncludes([...e.target.classList],returnClass)){
        e.dataTransfer.dropEffect = "none";
        return;
    }
    //ドロップ効果の設定
    e.dataTransfer.dropEffect = "move";
};

//要素が離れた際のイベントを定義
function handleDragLeave(e){
    e.target.classList.remove("over");
    e.target.classList.remove('overBackgroundChange');
};

//要素がドロップされたときのイベントを定義
function handleDrop(e){
    console.log(e.target)
    e.preventDefault();//ブラウザ既定を上書き
    e.target.classList.remove("over");
    e.target.classList.remove('overBackgroundChange')

    //転送データを取得
    const {id,parentId} = JSON.parse(e.dataTransfer.getData("application/json"));
    console.log(Array.from(e.target.classList));
    const eClassList = [...e.target.classList];
    if( isIncludes(eClassList,changeClass)){//boxにコースカードが入っている場合
        console.log("change")
        //ドロップ先に要素を移動
        let courseCard
        if(isIncludes(eClassList,changeClass0)){
            courseCard = e.target
        }else if(isIncludes(eClassList,changeClass1)){
            courseCard =  e.target.parentNode
        }else if (isIncludes(eClassList,changeClass2)){
            courseCard =  e.target.parentNode.parentNode
        }

        //以下の順序はcourseCard.parentNodeが変わるためこの順
        //保存してるデータを上書き
        chrome.storage.sync.set({[id]:courseCard.parentNode.id,[courseCard.id]:parentId})
        console.log({[id]:courseCard.parentNode.id,[courseCard.id]:parentId})
        
        //ドロップ先に移動
        courseCard.parentNode.appendChild(document.getElementById(id));
        //ドロップ元にドロップ先の要素を移動
        document.getElementById(parentId).appendChild(courseCard);

        
    }else{//boxがからの場合
        //ドロップ先に要素を追加
        e.target.appendChild(document.getElementById(id));
        
        e.target.classList.add("dropped");

        //ドロップ先を登録
        chrome.storage.sync.set({[id]:e.target.id});
        console.log({[id]:e.target.id})

        //ドロップ元に再配置を許可
        document.getElementById(parentId).classList.remove("dropped");
    }


}


//boxesがドロップ先、イベントを登録する
export function registerOverEvent(box,changeBackground = true){
    box.addEventListener("dragenter",handleDragEnter,false);
    box.addEventListener("dragover",handleDragOver,false)
    box.addEventListener("dragleave",handleDragLeave,false);
    box.addEventListener("drop",handleDrop,false);
}

export function registerOverEventArray(boxes,changeBackground = true){
    for (let box of boxes){
        registerOverEvent(box,changeBackground);
    }
}
export function registerOverEventDict(itemsDict,changeBackground = true){
    for(let key in itemsDict ){
        registerDragEvent(itemsDict[key],changeBackground);
    }
}
