export function createCourseCard(courseCard){
    //必要な要素を抽出
    const title = courseCard.getElementsByTagName("a")[0];;
    const teacher = courseCard.getElementsByClassName("courseitemdetail")[1];
    const courseLinkStatus = courseCard.getElementsByClassName("courselink-state")[0];//無いかもしれない
    const courseCardStatus = courseCard.getElementsByClassName("course-card-status")[0];
    const id = courseCard.getElementsByClassName("coursecode")[0].innerText
    //要素を成型
    title.setAttribute("draggable",false);
    title.className = "courseTitle";
    courseCardStatus.setAttribute("draggable",false);
    for (let item of courseCardStatus.children){
        item.className = "course-card-status-child";
        item.setAttribute("draggable",false)
    };

    //返すdivを作成
    const newCourseCard = document.createElement("div");
    newCourseCard.className = "newCourseCard";
    newCourseCard.id = id;
    newCourseCard.appendChild(title);
    newCourseCard.appendChild(teacher);
    if(courseLinkStatus){newCourseCard.appendChild(courseLinkStatus)}
    newCourseCard.appendChild(courseCardStatus);
    return newCourseCard


}