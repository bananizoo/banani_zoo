import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
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
            <a className={styles.primaryBtn} href="/calculator">
              Спробувати калькулятор
            </a>
            <a className={styles.secondaryBtn} href="/">
              Перейти в каталог
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>4</div>
              <div className={styles.statLabel}>учасники команди</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>MVP</div>
              <div className={styles.statLabel}>перший реліз</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>онлайн-доступ</div>
            </div>
          </div>
        </div>

        <div className={styles.heroCard} aria-label="BaNaNi highlights">
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

          <div className={styles.note}>
            Порада: для тестів Selenium зручно перевіряти переходи по Navbar та
            відображення сторінок.
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.feature}>
          <div className={styles.icon}>🧠</div>
          <h2>Розумні рекомендації</h2>
          <p>
            На основі параметрів тварини (вид, вік, вага) система підбирає
            релевантні товари та підказки.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.icon}>🛒</div>
          <h2>Покупка без зайвих кліків</h2>
          <p>
            Додавайте в кошик, порівнюйте позиції, зберігайте обране та
            оформлюйте онлайн-замовлення.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.icon}>🔒</div>
          <h2>Ролі і безпека</h2>
          <p>
            Передбачено авторизацію користувача та адмін-інтерфейс для керування
            товарами й замовленнями.
          </p>
        </div>
      </section>

      <section className={styles.split}>
        <div className={styles.block}>
          <h2 className={styles.h2}>Наша місія</h2>
          <p className={styles.p}>
            Створити сервіс, який допомагає власникам тварин швидко знаходити
            якісні товари та приймати правильні рішення щодо догляду.
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
            Проєкт розробляється Scrum-командою з 4 учасників. Ролі розподілено
            між фронтендом, бекендом, тестуванням і дизайном.
          </p>

          <div className={styles.team}>
            <div className={styles.member}>
              <div className={styles.avatar}>💻</div>
              <div>
                <div className={styles.memberTitle}>Backend</div>
                <div className={styles.memberText}>
                  API, бізнес-логіка, БД, авторизація
                </div>
              </div>
            </div>

            <div className={styles.member}>
              <div className={styles.avatar}>🎨</div>
              <div>
                <div className={styles.memberTitle}>Frontend / UI</div>
                <div className={styles.memberText}>
                  Навігація, сторінки, адаптивність, макети
                </div>
              </div>
            </div>

            <div className={styles.member}>
              <div className={styles.avatar}>✅</div>
              <div>
                <div className={styles.memberTitle}>QA</div>
                <div className={styles.memberText}>
                  Test Case, Selenium, перевірка сценаріїв
                </div>
              </div>
            </div>

            <div className={styles.member}>
              <div className={styles.avatar}>📌</div>
              <div>
                <div className={styles.memberTitle}>Scrum / Docs</div>
                <div className={styles.memberText}>
                  Backlog, Sprint планування, документація
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <h2 className={styles.ctaTitle}>Готові подивитися, як це працює?</h2>
          <p className={styles.ctaText}>
            Перейдіть у калькулятор або на головну — навбар зверху завжди поруч.
          </p>
        </div>
        <div className={styles.ctaButtons}>
          <a className={styles.primaryBtn} href="/calculator">
            Калькулятор
          </a>
          <a className={styles.secondaryBtn} href="/">
            Головна
          </a>
        </div>
      </section>
    </div>
  );
}