import Image from "next/image";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      
      {/* Великий логотип зверху */}
      <div className="flex justify-center mb-12">
        <Image 
          src="/logo.png" 
          alt="BaNaNi Logo" 
          width={460} 
          height={200}
          className="drop-shadow-2xl"
          priority
        />
      </div>

      {/* Перша секція - 3 блоки в потрібному порядку */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        
        {/* 1. Зліва - великий блок "Про нас" */}
        <div className="lg:col-span-7">
          <div className={styles.heroText}>
            <span className={styles.badge}>BaNaNi • зоомагазин</span>
            <h1 className={styles.title}>
              Про нас: турбота про хвостиків — це наша робота і любов 🐾
            </h1>
            <p className={styles.subtitle}>
              BaNaNi — вебзастосунок зоомагазину, який поєднує зручний каталог,
              персоналізовані підказки та швидке оформлення замовлення.
            </p>

            <div className={styles.actions}>
              <a className={styles.primaryBtn} href="/calculator">Спробувати калькулятор</a>
              <a className={styles.secondaryBtn} href="/">Перейти в каталог</a>
            </div>
<div className="mt-9 space-y-6">
  <p className="stat-row">
    <span className="stat-highlight">4</span>
    <span>учасники команди</span>
  </p>

  <p className="stat-row">
    <span className="stat-highlight">MVP</span>
    <span>перший реліз</span>
  </p>

  <p className="stat-row">
    <span className="stat-highlight">24/7</span>
    <span>онлайн-доступ</span>
  </p>
</div>
          </div>
        </div>

        {/* 2. Права колонка — "Чому BaNaNi?" + маленький логотип внизу */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className={styles.heroCard}>
            <div className={styles.cardHeader}>
              <div className={styles.logoMark}>🍌</div>
              <div>
                <div className={styles.cardTitle}>Чому BaNaNi?</div>
                <div className={styles.cardSubtitle}>
                  Банан + тваринки = впізнаваний бренд
                </div>
              </div>
            </div>

            <ul className={styles.checklist}>
              <li>Зручна навігація по категоріях</li>
              <li>Кошик, обране, порівняння</li>
              <li>Підбір товарів під профіль тварини</li>
              <li>Калькулятори: корм і шлейка</li>
            </ul>

{/* Маленький логотип мавпочки внизу для симетрії */}
<div className="flex justify-center mt-auto pt-8">
  <Image 
    src="/monkey_logo.png" 
    alt="BaNaNi Monkey" 
    width={110}
    height={110}
    className={styles.smallMonkeyLogo}
    priority
  />
</div>
          </div>

          {/* Розумні рекомендації */}
          <div className={styles.feature}>
            <div className={styles.icon}>🧠</div>
            <h2>Розумні рекомендації</h2>
            <p>
              На основі параметрів тварини (вид, вік, вага) система підбирає релевантні товари та підказки.
            </p>
          </div>
        </div>
      </div>

      {/* Нижні блоки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className={styles.feature}>
          <div className={styles.icon}>🛒</div>
          <h2>Покупка без зайвих кліків</h2>
          <p>Додавайте в кошик, порівнюйте позиції, зберігайте обране та оформлюйте онлайн-замовлення.</p>
        </div>

        <div className={styles.feature}>
          <div className={styles.icon}>🔒</div>
          <h2>Ролі і безпека</h2>
          <p>Передбачено авторизацію користувача та адмін-інтерфейс для керування товарами й замовленнями.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className={styles.block}>
          <h2 className={styles.h2}>Наша місія</h2>
          <p className={styles.p}>
            Створити сервіс, який допомагає власникам тварин швидко знаходити якісні товари та приймати правильні рішення щодо догляду.
          </p>
          <div className={styles.pills}>
            <span className={styles.pill}>Комфорт</span>
            <span className={styles.pill}>Турбота</span>
            <span className={styles.pill}>Простота</span>
            <span className={styles.pill}>Швидкість</span>
          </div>
        </div>

        <div className={styles.block}>
          <h2 className={styles.h2}>Команда</h2>
          <p className={styles.p}>
            Проєкт розробляється Scrum-командою з 4 учасників. Ролі розподілено між фронтендом, бекендом, тестуванням і дизайном.
          </p>
          <div className={styles.team}>
            <div className={styles.member}>
              <div className={styles.avatar}>💻</div>
              <div>
                <div className={styles.memberTitle}>Backend</div>
                <div className={styles.memberText}>API, бізнес-логіка, БД</div>
              </div>
            </div>
            <div className={styles.member}>
              <div className={styles.avatar}>🎨</div>
              <div>
                <div className={styles.memberTitle}>Frontend / UI</div>
                <div className={styles.memberText}>Навігація, сторінки</div>
              </div>
            </div>
            <div className={styles.member}>
              <div className={styles.avatar}>✅</div>
              <div>
                <div className={styles.memberTitle}>QA</div>
                <div className={styles.memberText}>Тестування</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA блок */}
<section className={styles.cta}>
  <div className="flex items-center justify-between gap-2 w-full">

    {/* ЛІВА ЧАСТИНА */}
    <div className="flex flex-col justify-center w-[50%] max-w-lg">

      <h2 className={styles.ctaTitle}>
        Готові подивитися, як це працює?
      </h2>

      <p className={`${styles.ctaText} mt-3`}>
        Перейдіть у калькулятор або на головну — навбар зверху завжди поруч.
      </p>

      {/* 🔥 ВІДСТУП ВІД ТЕКСТУ */}
      <div className={`${styles.ctaButtons} mt-6`}>
        <a className={styles.primaryBtn} href="/calculator">Калькулятор</a>
        <a className={styles.secondaryBtn} href="/">Головна</a>
      </div>

    </div>

    {/* ПРАВА ЧАСТИНА */}
<div className="flex items-center justify-center w-[50%]">
  <Image
    src="/logo.png"
    alt="BaNaNi"
    width={240}
    height={140}
    className="object-contain"
  />
</div>

  </div>
</section>
    </div>
  );
}