export function createCourseCard(courseCard) {
  // 必要な要素を抽出
  const title = courseCard.getElementsByTagName('a')[0]
  const teacher = courseCard.getElementsByClassName('teachers')[0]
  const courseCardStatus = courseCard.getElementsByClassName('status')[0]
  const id = courseCard.getElementsByClassName('code')[0].innerText

  // 要素を成型
  title.setAttribute('draggable', false)
  title.classList.add('course-title')
  courseCardStatus.setAttribute('draggable', false)
  for (const item of courseCardStatus.children) {
    item.classList.add('course-card-status-child')
    item.setAttribute('draggable', false)
  }

  // 返すdivを作成
  const newCourseCard = document.createElement('div')
  newCourseCard.className = 'new-course-card'
  newCourseCard.id = id
  newCourseCard.appendChild(title)
  newCourseCard.appendChild(teacher)
  newCourseCard.appendChild(courseCardStatus)
  return newCourseCard
}
