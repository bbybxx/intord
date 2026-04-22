export function Footer() {
  return (
    <footer className="mt-20 border-t border-sand-100 bg-sand-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-slate-600">© 2021-2026 ИНТЕРМАГ. Интернет-магазин одежды и обуви.</p>
            <p className="text-sm text-slate-500">Доставка по РФ. Обмен и возврат в течение 14 дней.</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Правовая информация</p>
            <div className="flex flex-col space-y-1">
              <a 
                href="/privacy-policy" 
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Правила обработки персональных данных
              </a>
              <a 
                href="/public-offer" 
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Публичная оферта
              </a>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Контакты</p>
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-slate-600">+7 (986) 927-94-57</p>
              <p className="text-sm text-slate-600">intermagllc@gmail.com</p>
              <p className="text-sm text-slate-500">Казань, ул. Толстого, дом 41, кабинет 7</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-sand-200">
          <p className="text-xs text-slate-500 text-center">
            Все права защищены. Любое использование материалов сайта возможно только с письменного разрешения.
          </p>
        </div>
      </div>
    </footer>
  );
}
