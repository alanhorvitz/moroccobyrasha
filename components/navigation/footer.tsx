import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} Morocco By Rasha. {t('footer.rights')}
          </p>
        </div>
        <div className="md:ml-auto md:flex md:items-center">
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="/privacy"
              className="text-muted-foreground underline-offset-4 hover:underline"
            >
              {t('footer.privacy')}
            </a>
            <a
              href="/terms"
              className="text-muted-foreground underline-offset-4 hover:underline"
            >
              {t('footer.terms')}
            </a>
            <a
              href="/contact"
              className="text-muted-foreground underline-offset-4 hover:underline"
            >
              {t('footer.contact')}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
} 