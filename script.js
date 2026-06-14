document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 데이터 관리 (localStorage 활용) ---
  // 브라우저에 저장된 유저 목록을 가져오거나, 없으면 빈 배열로 시작
  let registeredUsers = JSON.parse(localStorage.getItem('kingdom_users')) || [];
  let currentUser = JSON.parse(localStorage.getItem('kingdom_current_user')) || null;

  // UI 요소들
  const loginBtn = document.getElementById('login-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const closeModal = document.getElementById('close-modal');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // 로그인 상태에 따라 버튼 텍스트 변경 함수
  const updateLoginButton = () => {
    if (currentUser) {
      loginBtn.textContent = `${currentUser.nickname}님`;
      loginBtn.classList.add('user-profile-btn');
    } else {
      loginBtn.textContent = "로그인";
      loginBtn.classList.remove('user-profile-btn');
    }
  };
  updateLoginButton(); // 초기 실행

  // --- 2. 모달 제어 ---
  loginBtn.addEventListener('click', () => {
    if (currentUser) {
      // 이미 로그인 되어 있다면 로그아웃 처리
      if (confirm('로그아웃 하시겠습니까?')) {
        currentUser = null;
        localStorage.removeItem('kingdom_current_user');
        updateLoginButton();
        alert('로그아웃 되었습니다.');
      }
    } else {
      modalOverlay.style.display = 'flex';
    }
  });

  closeModal.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    resetForms();
  });

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    signupForm.classList.remove('hidden'); loginForm.classList.add('hidden');
  });

  // --- 3. 유효성 검사 (Validation) ---
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const setError = (el, isValid) => {
    el.closest('.input-group').classList.toggle('error', !isValid);
  };

  // --- 4. 회원가입 로직 (가입 시 DB에 저장) ---
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const pw = document.getElementById('signup-pw').value;
    const nick = document.getElementById('signup-nickname').value;

    const isEmailValid = validateEmail(email);
    const isPwValid = pw.length >= 8;
    const isNickValid = nick.length >= 2 && nick.length <= 10;

    setError(document.getElementById('signup-email'), isEmailValid);
    setError(document.getElementById('signup-pw'), isPwValid);
    setError(document.getElementById('signup-nickname'), isNickValid);

    if (isEmailValid && isPwValid && isNickValid) {
      // 중복 가입 체크
      if (registeredUsers.some(u => u.email === email)) {
        alert('이미 가입된 이메일입니다.');
        return;
      }

      // 유저 저장
      const newUser = { email, password: pw, nickname: nick };
      registeredUsers.push(newUser);
      localStorage.setItem('kingdom_users', JSON.stringify(registeredUsers)); // DB(저장소)에 저장
      
      alert('회원가입 성공! 로그인해 주세요.');
      tabLogin.click();
    }
  });

  // --- 5. 로그인 로직 (가입된 유저만 허용) ---
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pw = document.getElementById('login-pw').value;

    const user = registeredUsers.find(u => u.email === email && u.password === pw);

    if (user) {
      currentUser = user;
      localStorage.setItem('kingdom_current_user', JSON.stringify(user)); // 로그인 상태 저장
      updateLoginButton();
      modalOverlay.style.display = 'none';
      alert(`${user.nickname}님, 환영합니다!`);
    } else {
      setError(document.getElementById('login-email'), false);
      setError(document.getElementById('login-pw'), false);
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  });

  function resetForms() {
    loginForm.reset();
    signupForm.reset();
    document.querySelectorAll('.input-group').forEach(g => g.classList.remove('error'));
  }

  // --- 6. 기타 기능 (스토리 아코디언, 비디오 모달, 이미지 모달) ---
  // (이전 답변의 코드를 그대로 유지합니다)
  document.querySelectorAll('.story-accordion').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      const content = button.nextElementSibling;
      content.style.maxHeight = button.classList.contains('active') ? content.scrollHeight + "px" : null;
    });
  });

  window.openVideoModal = (url) => {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = url;
    modal.style.display = 'flex';
  };
  window.closeVideoModal = () => {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = '';
    modal.style.display = 'none';
  };

  window.openImageModal = (src, caption) => {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('full-image');
    const cap = document.getElementById('caption');
    img.src = src;
    cap.innerText = caption;
    modal.style.display = 'flex';
  };
  window.closeImageModal = () => {
    document.getElementById('image-modal').style.display = 'none';
  };

  window.onclick = (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('video-modal') || e.target.classList.contains('image-modal')) {
      modalOverlay.style.display = 'none';
      document.getElementById('video-modal').style.display = 'none';
      document.getElementById('image-modal').style.display = 'none';
    }
  };
});
