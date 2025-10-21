import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1 className="heading">Welcome to Twidilers!</h1>
      <h2>Made in collaboration with Oliver, wall03, and Derin.</h2>
      <p id="hideJS">
        <strong>Javascript needs to be enabled</strong> or{' '}
        <span title="Everything. Feed, profile, everything. We tested this.">most</span>{' '}
        of our site won&apos;t work properly. Plus, some functionality will be lost if your web browser hasn&apos;t been updated since 2016. Sorry!
      </p>
      <p>
        Twidilers is a social media platform that allows you to share your thoughts, ideas, and experiences with the world. 
        You can create an account, follow other users. This is a work in progress. If you encounter bugs, create an issue on our{' '}
        <a href="https://github.com/hihihioli/twidilers">GitHub</a>
      </p>
      <h2>Try exploring:</h2>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.getElementById("hideJS").style.display = "none";`,
        }}
      />
      <div id="cards">
        <Link href="/about">
          <button className="card">About Us!</button>
        </Link>
        <Link href="/feed">
          <button className="card">Go to feed</button>
        </Link>
      </div>
    </main>
  );
}
