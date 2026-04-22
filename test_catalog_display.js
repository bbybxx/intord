const fs = require('fs');

// Читаем обновленный файл
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

console.log('Проверка исправленных товаров:\n');

// Проверяем конкретные товары из списка пользователя
const testProducts = [
  { searchId: '295226', expectedArticle: '295226', oldArticle: '272529_bezhevye_krem_na_kozhanoy_podklade_1' },
  { searchId: '684538', expectedArticle: '684538', oldArticle: '272529_naplak_chernye_na_kozhanoy_podklade' },
  { searchId: '715286', expectedArticle: '715286', oldArticle: '381615_' },
  { searchId: '317640', expectedArticle: '317640', oldArticle: '381615_korichnevye_kofe_na_kozhanoy_podklade_1' },
  { searchId: '604705', expectedArticle: '604705', oldArticle: '785724_golubye_na_kozhanoy_podklade_1' },
  { searchId: '567800', expectedArticle: '567800', oldArticle: '785724_belye_na_kozhanoy_podklade' },
  { searchId: '497897', expectedArticle: '497897', oldArticle: '985552_nano_protector_250ml' }
];

let allPassed = true;

testProducts.forEach(test => {
  const product = products.find(p => p.id === test.searchId);
  
  if (!product) {
    console.log(`❌ Товар с ID ${test.searchId} не найден`);
    allPassed = false;
    return;
  }
  
  const shortDesc = product.shortDescription;
  const expectedShortDesc = `Артикул: ${test.expectedArticle}`;
  
  if (shortDesc === expectedShortDesc) {
    console.log(`✅ Товар "${product.name}" (ID: ${product.id}):`);
    console.log(`   shortDescription: "${shortDesc}"`);
    console.log(`   article: "${product.article}"`);
    console.log(`   Старый артикул: ${test.oldArticle} -> Очищенный: ${test.expectedArticle}\n`);
  } else {
    console.log(`❌ Товар "${product.name}" (ID: ${product.id}):`);
    console.log(`   Ожидалось: "${expectedShortDesc}"`);
    console.log(`   Получено: "${shortDesc}"`);
    console.log(`   article: "${product.article}"\n`);
    allPassed = false;
  }
});

// Также проверим, что нет товаров с подчеркиваниями в shortDescription
console.log('\nПроверка на наличие оставшихся товаров с подчеркиваниями в shortDescription:');
const productsWithUnderscoreInDesc = products.filter(p => 
  p.shortDescription && 
  p.shortDescription.includes('_') && 
  p.shortDescription.startsWith('Артикул: ')
);

if (productsWithUnderscoreInDesc.length === 0) {
  console.log('✅ Нет товаров с подчеркиваниями в shortDescription');
} else {
  console.log(`❌ Найдено ${productsWithUnderscoreInDesc.length} товаров с подчеркиваниями в shortDescription:`);
  productsWithUnderscoreInDesc.slice(0, 10).forEach((p, idx) => {
    console.log(`   ${idx + 1}. ID: ${p.id}, Название: ${p.name}`);
    console.log(`      shortDescription: "${p.shortDescription}"`);
    console.log(`      article: "${p.article}"`);
  });
  allPassed = false;
}

// Проверка согласованности article и shortDescription
console.log('\nПроверка согласованности article и shortDescription:');
let inconsistentCount = 0;

products.forEach(product => {
  if (product.shortDescription && product.shortDescription.startsWith('Артикул: ') && product.article) {
    const articleFromDesc = product.shortDescription.replace('Артикул: ', '').trim();
    if (articleFromDesc !== product.article) {
      // Это нормально, если в article есть подчеркивания, а в shortDescription - только цифры
      if (!product.article.includes('_') || articleFromDesc !== product.article.split('_')[0]) {
        inconsistentCount++;
        if (inconsistentCount <= 5) {
          console.log(`   Несоответствие: ID ${product.id}, article: "${product.article}", shortDescription: "${product.shortDescription}"`);
        }
      }
    }
  }
});

if (inconsistentCount === 0) {
  console.log('✅ Все товары имеют согласованные article и shortDescription');
} else {
  console.log(`⚠️  Найдено ${inconsistentCount} товаров с несоответствием article и shortDescription`);
}

console.log('\n' + (allPassed ? '✅ Все проверки пройдены успешно!' : '❌ Есть проблемы, требующие внимания'));