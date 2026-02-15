def email_template() -> tuple[str, str, str]:
    subject = "Ура, вы только что активировали аккаунт!"

    text = """
Дорогой студент!

Мы рады приветствовать тебя в нашей студии! С этой минуты начинается твоё обучение.

Теперь твой аккаунт успешно создан, и ты можешь войти в систему и начать обучение.

Если у тебя возникнут вопросы или потребуется помощь, наша команда всегда готова помочь.

Желаем приятного и продуктивного обучения!
С уважением, команда студии DNK
"""

    html = """
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
<html>
  <body style="margin:0;padding:0;background:#ffffff;font-family:sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <table width="600" style="background:#ffffff;color:#ffffff;border-radius:10px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:#171717;padding:20px;text-align:left;">
                <h1 style="margin:0;color:#ffffff;letter-spacing:1px;font-size:48px; font-family: 'Montserrat', sans-serif;">
                  DNK STUDIO
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#272727;">

                <h2 style="color:#171717;margin-top:0;">
                  Добро пожаловать!
                </h2>

                <p>
                  Дорогой студент,
                </p>

                <p>
                  Мы рады приветствовать тебя в нашей студии! Твой аккаунт успешно активирован,
                  и теперь ты можешь начать обучение.
                </p>

                <p>
                  В личном кабинете уже доступны материалы и расписание занятий.
                </p>

                <a href="https://your-site.com/login"
                   style="
                   display:inline-block;
                   margin-top:20px;
                   padding:12px 24px;
                   background:#c40000;
                   color:#ffffff;
                   text-decoration:none;
                   border-radius:10px;
                   font-weight:bold;">
                   Войти в аккаунт
                </a>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#c40000;padding:15px;text-align:center;color:white;font-size:12px;">
                © dnk studio • Все права защищены
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
"""
    return subject, text, html
