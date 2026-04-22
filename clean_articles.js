const fs = require('fs');
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

console.log('Всего товаров:', products.length);

// Найдем товары с артикулами, содержащими подчеркивания
const productsWithUnderscore = products.filter(p => p.article && p.article.includes('_'));
console.log('Товаров с подчеркиваниями в артикулах:', productsWithUnderscore.length);

// Покажем первые 10
console.log('\nПервые 10 товаров с подчеркиваниями:');
productsWithUnderscore.slice(0, 10).forEach((product, idx) => {
  console.log(`${idx + 1}. Артикул: ${product.article}, ID: ${product.id}, Название: ${product.name}`);
});

// Проверим конкретные проблемные артикулы
const problematicArticles = [
  '272529_bezhevye_krem_na_kozhanoy_podklade_1',
  '272529_naplak_chernye_na_kozhanoy_podklade',
  '381615_',
  '381615_korichnevye_kofe_na_kozhanoy_podklade_1',
  '785724_golubye_na_kozhanoy_podklade_1',
  '785724_belye_na_kozhanoy_podklade',
  '985552_nano_protector_250ml'
];

console.log('\n\nПоиск конкретных проблемных артикулов:');
let foundCount = 0;
problematicArticles.forEach(article => {
  const matchingProducts = products.filter(p => p.article === article);
  
  if (matchingProducts.length > 0) {
    console.log(`\nАртикул: ${article}`);
    console.log(`Найдено товаров: ${matchingProducts.length}`);
    
    matchingProducts.forEach((product, idx) => {
      console.log(`  ${idx + 1}. ID: ${product.id}, Название: ${product.name}`);
      console.log(`     Категория: ${product.categoryId}, Цена: ${product.price} руб.`);
    });
    foundCount += matchingProducts.length;
  } else {
    console.log(`\nАртикул ${article} не найден`);
  }
});

console.log(`\nВсего найдено проблемных товаров: ${foundCount}`);

// Создадим очищенную версию артикулов
console.log('\n\nОчистка артикулов:');
const cleanedProducts = products.map(product => {
  if (!product.article) return product;
  
  const originalArticle = product.article;
  // Оставляем только цифровую часть (первые 6 цифр до подчеркивания)
  const cleanedArticle = originalArticle.split('_')[0];
  
  // Проверяем, что это 6 цифр
  const isSixDigits = /^\d{6}$/.test(cleanedArticle);
  
  if (originalArticle !== cleanedArticle) {
    console.log(`Очистка: ${originalArticle} -> ${cleanedArticle} (${isSixDigits ? 'OK' : 'НЕ 6 цифр'})`);
  }
  
  return {
    ...product,
    article: cleanedArticle
  };
});

// Проверим, не создали ли мы дубликатов
const articleMap = {};
const duplicates = [];

cleanedProducts.forEach(product => {
  if (!product.article) return;
  
  if (articleMap[product.article]) {
    duplicates.push({
      article: product.article,
      product1: articleMap[product.article],
      product2: product.id
    });
  } else {
    articleMap[product.article] = product.id;
  }
});

console.log(`\nНайдено потенциальных дубликатов артикулов: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.log('Дубликаты:');
  duplicates.forEach(dup => {
    console.log(`  Артикул ${dup.article}: товары ${dup.product1} и ${dup.product2}`);
  });
}

// Сохраним очищенные данные
fs.writeFileSync('data/products_cleaned.json', JSON.stringify(cleanedProducts, null, 2));
console.log('\nОчищенные данные сохранены в data/products_cleaned.json');