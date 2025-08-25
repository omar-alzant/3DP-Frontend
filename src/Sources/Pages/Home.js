import '../Style/Home.css'; // ملف التنسيق

function Home() {

  return (
    <>
    <div className="home-container">
      <header className="home-header">
        <h1>مرحباً بكم في مصنع الابتكار</h1>
        <p>نقدم خدمات متقدمة في الطباعة ثلاثية الأبعاد والنقش بالليزر.</p>
      </header>

      <section className="section">
        <h2>🌀 الطباعة بالليزر</h2>
        <p>نستخدم تقنيات الليزر الدقيقة لقص ونقش الخشب، الأكريليك، الجلود، والمعادن الخفيفة لتقديم تصاميم فنية أو صناعية مخصصة.</p>
      </section>

      <section className="section">
        <h2>🧵 الطباعة ثلاثية الأبعاد (Filament)</h2>
        <p>نطبع نماذجك باستخدام خيوط PLA وPETG وغيرها، سواء كانت قطع غيار، نماذج تعليمية أو منتجات مبتكرة.</p>
      </section>

      <section className="section">
        <h2>🧪 الطباعة ثلاثية الأبعاد بالريزن (Resin)</h2>
        <p>نطبع مجسمات عالية الدقة مثالية للتفاصيل الدقيقة مثل المجوهرات، التماثيل أو النماذج الطبية.</p>
      </section>

      <footer className="footer">
        <p>تواصل معنا عبر واتساب أو انستغرام للحصول على عرض سعر أو استشارة مجانية</p>
      </footer>
    </div>
  </>
  );
}

export default Home;
