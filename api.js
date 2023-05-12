window.onload = () => {
    console.log("api.js 로딩됨")
}

const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"



// 회원가입
async function handleSignin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const passwordCheck = document.getElementById("password-check").value
    const email = document.getElementById("email").value
    const realname = document.getElementById("realname").value
    const age = document.getElementById("age").value
    const introduction = document.getElementById("introduction").value
    console.log(username, password)

    const response = await fetch(`${backend_base_url}/users/signup/`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password1": password,
            "password2": passwordCheck,
            "email": email,
            "name": realname,
            "age": age,
            "introduction": introduction,
        })
    })

    return response
}

// 로그인
async function handleLogin() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/users/api/token/`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })

    return response
}

// 뭐하는 애더라?
async function handleMock() {
    const response = await fetch(`${backend_base_url}/users/mock/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })
    console.log(response)
}

// 로그아웃
function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${frontend_base_url}/`)
}

// 로그인 상태에서 로그인, 회원가입 페이지 접속 시 홈으로 이동하는 함수
function checkLogin() {
    const payload = localStorage.getItem("payload")
    if (payload) {
        window.location.replace(`${frontend_base_url}/`)
    }
}

// 비로그인 상태에서 글쓰기 페이지 접속 시 홈으로 이동하는 함수
function checkNotLogin() {
    const payload = localStorage.getItem("payload")
    if (payload == null) {
        window.location.replace(`${frontend_base_url}/`)
    }
}

// 게시글 조회
async function getPosts() {
    const response = await fetch(`${backend_base_url}/posts/`)
    console.log(response)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는 데 실패했습니다")
    }
}

// 게시글 작성
async function createPost() {
    const title = document.getElementById("title").value
    const content = document.getElementById("content").value
    const image = document.getElementById("image").files[0]

    const formdata = new FormData();

    formdata.append("title", title)
    formdata.append("content", content)
    formdata.append("image", image || '') // 이미지 안 올리면 폼데이터에 ''로 들어가게 함(이렇게 안 하면 undefined가 들어가서 400에러뜸)

    let token = localStorage.getItem("access")

    const response = await fetch(`${backend_base_url}/posts/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formdata
    })

    if (response.status == 201) {
        alert("글 작성 완료!")
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.statusText)
    }
}

// 상세 게시글 조회
async function getPost(postId) {
    const response = await fetch(`${backend_base_url}/posts/${postId}/`)

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.statusText)
    }
}

// 댓글 조회
async function getComments(postId) {
    const response = await fetch(`${backend_base_url}/posts/${postId}/comments/`,)

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}

//댓글 작성
async function postComment(postId, newComment){
        
    let token = localStorage.getItem("access")
    
    const response = await fetch(`${backend_base_url}/posts/${postId}/comments/`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${token}`
        }, 
        body: JSON.stringify({
            "content": newComment
        })
    }
    )

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}