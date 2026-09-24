/**
 * IndexNow Instant Indexing Script for manojkc1.com.np
 * Notifies search engines (Bing, Yandex, Naver, Seznam) instantly upon build/deployment.
 */
async function submitIndexNow() {
  const host = 'manojkc1.com.np';
  const key = '5c8e2b85fa174f85b8fa8b7d91e428bc';
  const keyLocation = `https://${host}/${key}.txt`;
  const urlList = [
    `https://${host}/`,
    `https://${host}/projects`,
    `https://${host}/skills`,
    `https://${host}/experience`,
  ];

  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  console.log(`[IndexNow] Pinging search engines for ${urlList.length} URLs...`);

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Success! Response status: ${res.status}`);
    } else {
      console.warn(`[IndexNow] Received response status: ${res.status}`);
    }
  } catch (err) {
    console.error('[IndexNow] Submission error (non-fatal):', err);
  }
}

submitIndexNow();
