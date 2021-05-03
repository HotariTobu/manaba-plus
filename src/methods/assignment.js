"use strict"
import * as component from './component.js';
let MANAGE_CLS = "MD-assignment";
let pre_clicked_label = "deadline";
let continuous_click = 1;
let backup_AY;
let show_disable = false;
export let insert_button = () => {
	let mark = document.getElementsByClassName("contentbody-left")[0];
	mark.insertAdjacentHTML('afterbegin', '<a id="show-assignment">未提出課題を表示</a><a id="toggle_disable" style="display:none">非表示も表示</a><table id="assignment-table"><tbody id="add-parent"><tr id="show-assignment-fin"><td><p id="assignment-message"></p></td></tr></tbody></table>');
	let show_assignment_button = document.getElementById('show-assignment');
	let assignment_table = document.getElementById('assignment-table');
	assignment_table.style.width = '100%';
	assignment_table.style.padding = '2px 15px 5px 0px';
	show_assignment_button.addEventListener('click', () => {
		show_assignment_button.innerHTML = "読み込み中";
		load_unsub();
	});
}
async function load_unsub() {
	let assignment_yet = await get_assignment();
	set_assignment(assignment_yet);
}
let input_click = () => {
	collect_and_preserve();
	review_table(backup_AY);
	function collect_and_preserve() {
		let disable_href = [];
		for (let row of backup_AY) {
			if (row.disable == true) {
				disable_href.push(row.href);
			}
		}
		chrome.storage.sync.set({ hided_assignment: disable_href }, function () {
		});
	}
}
let review_table = (rows, sort_base = "deadline", reverse = false) => {
	clear_assignment();
	insert_label(sort_base, reverse);
	let enable_rows = filter();
	insert_rows(enable_rows);
	function filter() {
		let enable_row = [];
		for (let row of rows) {
			if (show_disable == false) {//フィルターがオンの場合
				if (row.disable == true) continue;//非表示なら表示しない
			}
			enable_row.push(row);
		}
		//ソート
		enable_row.sort((a, b) => {
			if (reverse) {
				if (a[sort_base] >= b[sort_base]) { return -1; } else { return 1; }
			} else {
				if (a[sort_base] < b[sort_base]) { return -1; } else { return 1; }
			}
		});
		return enable_row;
	}
	function insert_label(_sort_base, _reverse) {
		let tr = document.createElement("tr");
		tr.classList.add("topic");//追加
		tr.classList.add(MANAGE_CLS);

		let sort_bases = ["course_name", "assignment_name", null, "start_time", "deadline"];
		let texts = ["コース", "題名", "非表示", "受付開始", "受付終了"];
		for (let i = 0; i < 5; i++) {
			//削除
			//let td = tr.insertCell();

			let th = document.createElement("th");//追加
			tr.appendChild(th);//追加
			//以下tdをthに変更

			th.innerHTML = texts[i];
			if (sort_bases[i] == _sort_base) {
				th.innerHTML = _reverse ? texts[i] + "▼" : texts[i] + "▲";
			}
			if (!sort_bases[i]) continue;
			th.classList.add("label");
			th.onclick = function () {
				let closer = () => {
					let reverse = continuous_click % 2;
					if (pre_clicked_label == sort_bases[i]) continuous_click++;
					else continuous_click = 0;
					pre_clicked_label = sort_bases[i];
					review_table(backup_AY, sort_bases[i], reverse);
				}
				return closer;
			}();
		}
		let add_parent = document.getElementById('add-parent');
		let show_assignment_fin = document.getElementById('show-assignment-fin');
		add_parent.insertBefore(tr, show_assignment_fin);
	}
	function insert_rows(rows) {
		if (rows.length == 0) {
			document.getElementById('assignment-message').innerHTML = "課題はありませんでした・ω・";
		} else {
			document.getElementById('assignment-message').innerHTML = "";
			let show_assignment_fin = document.getElementById('show-assignment-fin');
			let add_parent = document.getElementById('add-parent');
			for (let row of rows) {
				add_parent.insertBefore(row.get_td(), show_assignment_fin);
			}
		}
	}
	function clear_assignment() {
		let remove_rows = document.getElementsByClassName(MANAGE_CLS);
		while (remove_rows.length) {
			remove_rows[0].remove();
		}
	}
}
async function get_assignment() {
	return await new Promise(resolve => {
		let assignment_yet = []
		let course_size = 0;
		let course_n = 0;
		let courses = component.getCourses();
		let suffixs = ['_query', '_survey', '_report'];
		course_size = courses.length * suffixs.length;
		for (let course of courses) {
			for (let suffix of suffixs) {
				let url = course['href'] + suffix;
				let request = new XMLHttpRequest();
				request.addEventListener('load', () => {
					received_course(request.responseText, course.name);
				});
				request.course = course['name'];
				request.open('get', url);
				request.send();
			}
		}
		function received_course(responseText, course_name) {
			let domparser = new DOMParser();
			let doc = domparser.parseFromString(responseText, 'text/html');
			let stdlist = doc.getElementsByClassName("stdlist")[0]
			let rows = [];
			if (stdlist) {
				rows = stdlist.getElementsByTagName("tr");
			}
			for (let row of rows) {
				let text = row.children[1].innerHTML;
				if (text.includes("受付中") && text.includes("未提出")) {
					let ass = new Assignment();
					ass.init_row(row, course_name);
					assignment_yet.push(ass);
				}
			}
			progress('course');
		}
		function progress(type) {
			if (type == 'course') {
				course_n += 1;
			}
			if (course_size == course_n) {
				document.getElementById('show-assignment').style.display = 'none';
				resolve(assignment_yet);
			}
		}
	});
}
let set_assignment = (assignment_yet) => {
	backup_AY = assignment_yet;
	let hided_assignment;
	start();
	async function start() {
		insert_toggle();
		hided_assignment = await new Promise((resolve) => {
			chrome.storage.sync.get(["hided_assignment"], function (result) {
				if (!result.hided_assignment) resolve([]);
				resolve(result.hided_assignment);
			});
		});
		Assignment.set_disables(assignment_yet, hided_assignment);
		document.getElementById('show-assignment').style.display = "none";
		review_table(assignment_yet);
	}
	function insert_toggle() {
		document.getElementById('toggle_disable').style.display = "inline-block";
		document.getElementById('toggle_disable').onclick = () => {
			show_disable = !show_disable;
			review_table(assignment_yet);
			if (show_disable) {
				document.getElementById('toggle_disable').innerHTML = "非表示にする";
			} else {
				document.getElementById('toggle_disable').innerHTML = "非表示も表示";
			}
		}
	}
}
class Assignment {
	init_json(dict) {
		this.course_name = dict.course_name;
		this.href = dict.href;
		this.assignment_name = dict.assignment_name;
		this.status = dict.status;
		this.disable = dict.disable;
		this.start_time = new Date(dict.start_time);
		this.deadline = new Date(dict.deadline);
		this.color_code = dict.color_code;
	}
	init_row(row, course_name) {
		this.course_name = course_name;
		this.href = row.children[0].getElementsByTagName("a")[0].href;
		this.assignment_name = row.children[0].getElementsByTagName("a")[0].innerHTML;
		this.status = "受付中";
		this.disable = true;
		this.start_time = new Date(row.children[2].innerHTML);
		this.deadline = row.children[3].innerHTML ? new Date(row.children[3].innerHTML) : Infinity;
		this.color_code = this.get_color(this.deadline);
	}
	static set_disables(assignments, hide_urls) {
		for (let ass of assignments) {
			if (hide_urls.includes(ass.href)) {
				ass.disable = true;
			} else {
				ass.disable = false;
			}
		}
	}
	get_color(deadline) {
		if(deadline == Infinity)return "#e8e8e8";
		let now_time = new Date(new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }));
		let time_diff = deadline.getTime() - now_time.getTime();
		let day_diff = Math.floor(time_diff / (1000 * 60 * 60 * 24));
		if (day_diff < 1) {
			return '#ffe6e9';
		} else if (day_diff < 3) {
			return '#fff4d1';
		} else if (day_diff < 7) {
			return '#cce8cc';
		} else {
			return "#e8e8e8";
		}
	}
	date_to_str(date) {
		if(date == Infinity) return ""
		let dates_jp = ["日", "月", "火", "水", "木", "金", "土"];
		let txt = "";
		txt += (date.getMonth()+1) + "/";
		txt += date.getDate() + "(";
		txt += dates_jp[date.getDay()] + ") ";
		txt += date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
		return txt;
	}
	setup_input(td) {
		td.classList.add("input");
		td.onclick = (e) => {
			this.disable = !this.disable;
			input_click();
			e.stopPropagation();
		}
		if (this.disable == true) {
			td.innerHTML = '<input type="checkbox" checked="true">'
		} else {
			td.innerHTML = '<input type="checkbox">'
		}
	}
	get_td() {
		let tr = document.createElement("tr");
		tr.classList.add(MANAGE_CLS);

		let td_course = tr.insertCell();
		td_course.innerHTML = this.course_name;
		td_course.classList.add("course");

		let td_ass = tr.insertCell();
		td_ass.innerHTML = "<a href='" + this.href + "'>" + this.assignment_name + "</a>";
		td_ass.classList.add("ass");
		this.setup_input(tr.insertCell());
		tr.insertCell().innerHTML = this.date_to_str(this.start_time)
		tr.insertCell().innerHTML = this.date_to_str(this.deadline)
		tr.style.backgroundColor = this.color_code;
		return tr;
	}
}
//CODE FOR DEVELOPMENT
/*
let DEV = JSON.parse('[{"course_name":"社会情報学２","href":"https://room.chuo-u.ac.jp/ct/course_2369010_report_2631393","assignment_name":"第3回講義レポート","status":"受付中","disable":true,"start_time":"2021-04-23T08:00:00.000Z","deadline":"2021-04-29T14:55:00.000Z","color_code":"#cce8cc"},{"course_name":"実践プログラミング","href":"https://room.chuo-u.ac.jp/ct/course_2369115_report_2653818","assignment_name":"[03A]","status":"受付中","disable":true,"start_time":"2021-04-22T04:00:00.000Z","deadline":"2021-04-27T03:00:00.000Z","color_code":"#fff4d1"},{"course_name":"計算幾何学","href":"https://room.chuo-u.ac.jp/ct/course_2368875_query_2649329","assignment_name":"第3回小テスト","status":"受付中","disable":true,"start_time":"2021-04-23T05:30:00.000Z","deadline":"2021-04-25T15:00:00.000Z","color_code":"#ffe6e9"},{"course_name":"ディジタル信号処理","href":"https://room.chuo-u.ac.jp/ct/course_2368995_report_2606859","assignment_name":"第1回演習問題","status":"受付中","disable":true,"start_time":"2021-04-14T07:50:00.000Z","deadline":"2021-04-28T06:10:00.000Z","color_code":"#cce8cc"},{"course_name":"ディジタル信号処理","href":"https://room.chuo-u.ac.jp/ct/course_2368995_report_2610929","assignment_name":"第2回演習問題","status":"受付中","disable":true,"start_time":"2021-04-21T07:50:00.000Z","deadline":"2021-04-28T06:10:00.000Z","color_code":"#cce8cc"}]');
export let dev = ()=>{
	let rows = [];
	for(let a of DEV){
		let r = new Assignment();
		r.init_json(a);
		rows.push(r);
	}
	set_assignment(rows);
}
*/