import React from 'react';

export const GithubButton: React.FC = () => (
  <div className="ui message">
    <p>
      본 뷰어는
      {' '}
      <a
        href="https://enghqii.tistory.com/42"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        &lt;급여명세서 복호화하기&gt;
      </a>
      를 바탕으로 만들어졌으며 온라인으로 어떠한 정보도 전송하지 않습니다.
    </p>
  </div>
);

export default GithubButton;
