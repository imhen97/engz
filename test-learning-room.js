const { chromium } = require('playwright');

async function testLearningRoom() {
  // 기존 브라우저 세션을 사용하여 쿠키 유지
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox']
  });
  
  // 사용자 데이터 디렉토리를 사용하여 로그인 상태 유지
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('🚀 테스트 시작...');

  try {
    // 1. 먼저 로그인 페이지로 이동
    console.log('📍 로그인 페이지로 이동...');
    await page.goto('https://www.eng-z.com/signup', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 2. 카카오 로그인 버튼 확인
    const kakaoButton = page.locator('button:has-text("카카오")');
    const kakaoVisible = await kakaoButton.isVisible().catch(() => false);
    
    if (kakaoVisible) {
      console.log('✅ 카카오 로그인 버튼 발견');
      console.log('🖱️ 카카오 로그인 버튼 클릭...');
      await kakaoButton.click();
      
      // 카카오 로그인 페이지 대기
      await page.waitForTimeout(3000);
      
      // 카카오 로그인 페이지에서 로그인 진행 (수동으로 해야 함)
      console.log('\n⚠️ 카카오 로그인 페이지가 열렸습니다.');
      console.log('👉 수동으로 카카오 로그인을 완료해주세요.');
      console.log('⏳ 로그인 완료 후 자동으로 계속됩니다... (60초 대기)');
      
      // 로그인 완료 대기 (eng-z.com으로 리다이렉트될 때까지)
      try {
        await page.waitForURL('**/eng-z.com/**', { timeout: 60000 });
        console.log('✅ 로그인 완료!');
      } catch (e) {
        console.log('⚠️ 로그인 대기 시간 초과. 현재 페이지에서 계속...');
      }
    }

    // 3. 학습룸으로 이동
    console.log('\n📍 학습룸 페이지로 이동...');
    await page.goto('https://www.eng-z.com/learning-room', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // 4. 페이지 상태 확인
    const pageTitle = await page.title();
    const currentUrl = page.url();
    console.log('📄 현재 URL:', currentUrl);
    console.log('📄 페이지 제목:', pageTitle);

    // 5. 로그인 상태 확인
    if (currentUrl.includes('signup')) {
      console.log('\n❌ 로그인이 필요합니다.');
      console.log('👉 브라우저에서 수동으로 카카오 로그인을 완료해주세요.');
      console.log('⏳ 2분간 대기합니다...');
      
      // 수동 로그인 대기
      await page.waitForTimeout(120000);
      
      // 다시 학습룸으로 이동 시도
      await page.goto('https://www.eng-z.com/learning-room', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
    }

    // 6. 미션 버튼 찾기
    const missionButton = page.locator('button:has-text("답변 녹음")').first();
    const buttonVisible = await missionButton.isVisible().catch(() => false);
    
    if (buttonVisible) {
      console.log('\n✅ 미션 버튼 발견!');
      
      // 7. 버튼 클릭
      console.log('🖱️ 미션 버튼 클릭...');
      await missionButton.click();
      await page.waitForTimeout(2000);

      // 8. 모달 확인
      const modal = page.locator('div:has-text("오늘의 미션")').filter({ has: page.locator('textarea') });
      const modalVisible = await modal.isVisible().catch(() => false);
      
      if (modalVisible) {
        console.log('✅ 미션 연습 모달 열림!');
        
        // 9. 텍스트 입력
        const textarea = page.locator('textarea[placeholder*="영어"]');
        if (await textarea.isVisible()) {
          console.log('✅ 텍스트 입력 영역 발견');
          await textarea.fill('I am practicing present tense. She walks to school every day. They play soccer on weekends. He reads books at night. We eat breakfast together.');
          console.log('✅ 테스트 텍스트 입력 완료');
          
          // 10. 제출 버튼 클릭
          const submitButton = page.locator('button:has-text("제출")');
          if (await submitButton.isVisible()) {
            console.log('🖱️ 제출 버튼 클릭...');
            await submitButton.click();
            
            // 11. AI 피드백 대기
            console.log('⏳ AI 피드백 대기 중... (최대 30초)');
            
            try {
              await page.waitForSelector('text=총점', { timeout: 30000 });
              console.log('✅ AI 피드백 수신 완료!');
              
              // 점수 캡처
              const scoreText = await page.locator('text=총점').first().textContent();
              console.log('📊 피드백:', scoreText);
              
              // 스크린샷 저장
              await page.screenshot({ path: 'mission-feedback.png' });
              console.log('📸 피드백 스크린샷 저장됨: mission-feedback.png');
              
            } catch (e) {
              console.log('⚠️ AI 피드백 대기 시간 초과');
              await page.screenshot({ path: 'feedback-timeout.png' });
            }
          }
        }
      } else {
        console.log('❌ 모달이 열리지 않음');
        await page.screenshot({ path: 'modal-not-found.png' });
      }
    } else {
      console.log('\n❌ 미션 버튼을 찾을 수 없음');
      console.log('현재 페이지 내용을 확인합니다...');
      
      // 페이지에서 찾을 수 있는 버튼들 확인
      const buttons = await page.locator('button').allTextContents();
      console.log('발견된 버튼들:', buttons.slice(0, 10));
      
      await page.screenshot({ path: 'learning-room-debug.png' });
      console.log('📸 스크린샷 저장됨: learning-room-debug.png');
    }

    console.log('\n🔍 테스트 완료! 브라우저를 확인해주세요.');
    console.log('5분 후 자동 종료됩니다. 직접 종료하려면 Ctrl+C를 누르세요.');
    
    await page.waitForTimeout(300000); // 5분 대기

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 에러 스크린샷 저장됨: error-screenshot.png');
  }

  await browser.close();
}

testLearningRoom();
