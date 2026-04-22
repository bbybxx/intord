const fs = require('fs');

// Читаем исходный файл
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

console.log('Всего товаров:', products.length);

// Список старых артикулов, которые нужно исправить
const oldArticlesToFix = [
  '272529_bezhevye_krem_na_kozhanoy_podklade_1',
  '272529_naplak_chernye_na_kozhanoy_podklade',
  '381615_',
  '381615_korichnevye_kofe_na_kozhanoy_podklade_1',
  '785724_golubye_na_kozhanoy_podklade_1',
  '785724_belye_na_kozhanoy_podklade',
  '985552_nano_protector_250ml'
];

// Также будем исправлять все артикулы с подчеркиваниями
let fixedCount = 0;
let fixedOldArticles = 0;

const updatedProducts = products.map(product => {
  // Проверяем shortDescription
  if (product.shortDescription && product.shortDescription.startsWith('Артикул: ')) {
    const currentDesc = product.shortDescription;
    
    // Извлекаем текущий артикул из shortDescription
    const currentArticleInDesc = currentDesc.replace('Артикул: ', '').trim();
    
    // Проверяем, нужно ли его исправить
    // 1. Если он содержит подчеркивание
    // 2. Или если он в списке старых артикулов
    const needsFix = currentArticleInDesc.includes('_') || 
                     oldArticlesToFix.includes(currentArticleInDesc);
    
    if (needsFix) {
      // Используем очищенный артикул из поля article
      // Если в article тоже есть подчеркивания, берем только цифровую часть
      let cleanArticle = product.article;
      if (cleanArticle && cleanArticle.includes('_')) {
        cleanArticle = cleanArticle.split('_')[0];
      }
      
      // Проверяем, что cleanArticle состоит из цифр
      if (cleanArticle && /^\d+$/.test(cleanArticle)) {
        const newShortDescription = `Артикул: ${cleanArticle}`;
        
        if (currentDesc !== newShortDescription) {
          console.log(`Исправляем: "${currentDesc}" -> "${newShortDescription}" (ID: ${product.id}, Название: ${product.name})`);
          fixedCount++;
          
          // Отмечаем, если это один из указанных старых артикулов
          if (oldArticlesToFix.includes(currentArticleInDesc)) {
            fixedOldArticles++;
          }
          
          return {
            ...product,
            shortDescription: newShortDescription
          };
        }
      }
    }
  }
  
  return product;
});

console.log(`\nИсправлено товаров: ${fixedCount}`);
console.log(`Из них указанных старых артикулов: ${fixedOldArticles}`);

// Сохраняем обновленный файл
fs.writeFileSync('data/products.json', JSON.stringify(updatedProducts, null, 2));
console.log('\nОбновленные данные сохранены в data/products.json');

// Также обновим products_cleaned.json для согласованности
const cleanedProducts = JSON.parse(fs.readFileSync('data/products_cleaned.json', 'utf8'));
const updatedCleanedProducts = cleanedProducts.map(product => {
  if (product.shortDescription && product.shortDescription.startsWith('Артикул: ')) {
    const currentDesc = product.shortDescription;
    const currentArticleInDesc = currentDesc.replace('Артикул: ', '').trim();
    
    if (currentArticleInDesc.includes('_') || oldArticlesToFix.includes(currentArticleInDesc)) {
      let cleanArticle = product.article;
      if (cleanArticle && cleanArticle.includes('_')) {
        cleanArticle = cleanArticle.split('_')[0];
      }
      
      if (cleanArticle && /^\d+$/.test(cleanArticle)) {
        return {
          ...product,
          shortDescription: `Артикул: ${cleanArticle}`
        };
      }
    }
  }
  return product;
});

fs.writeFileSync('data/products_cleaned.json', JSON.stringify(updatedCleanedProducts, null, 2));
console.log('Обновленные данные также сохранены в data/products_cleaned.json');