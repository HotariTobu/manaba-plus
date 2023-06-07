window.onload = ()=>{

    //uiを読み込む
    let saturday = document.getElementById("saturday");
    let column = document.getElementById("column");
    let additionalColumn = document.getElementById("additionalColumn");
    let additionalTitle = document.getElementById("additionalTitle");
    let registerButton = document.getElementById("registerButton");
    

    //init
    const currentSetting = chrome.storage.sync.get(
        [
            "saturday",
            "column",
            "additionalColumn",
            "additionalTitle"
        ]
        );
    currentSetting.then(onGot,onError);
        
    function onGot(info){
        saturday.checked = info["saturday"];
        column.selectedIndex = info["column"]-1;//〇が無いのでその分インデックスに変換
        additionalColumn.selectedIndex = info["additionalColumn"];
        additionalTitle.value = info["additionalTitle"];
    }
    function onError(error){
        console.log(`Error: ${error}`);
    }

    //登録ボタンに登録処理を紐づける
    registerButton.addEventListener("click",()=>{
        
        chrome.storage.sync.set({
            "saturday":saturday.checked,
            "column":column.value,
            "additionalColumn":additionalColumn.value,
            "additionalTitle":additionalTitle.value

        });
        
    })

}