

const discounts = [
	[5, { value: 100, cond: 150 }], 
	[10, 200],
	[15, 300],
	[20, 500],
];

const snickers = [{
  id: 1,
  company: 'Nike',
  name: '  Nike Air Force 1    ',
  size: 42,
  price: '10000rub',
  discountType: null,
  hashTags: ['Nike', '', ['Кроссовки,Искусственная кожа'], 'Бюджетные'],
}, {
  id: 2,
  company: 'Converse',
  name: 'Converse One Star  ',
  size: 40,
  price: 300,
  discountType: 20,
  hashTags: ['Converse', 'Кеды', 'Замша', 'Бюджетные'],
}, {
  id: 3,
  company: 'Nike',
  name: 'Nike Air Force 1',
  size: null,
  price: null,
  discountType: null,
  hashTags: [],
}, {
  id: 4,
  company: 'Balenciaga',
  name: 'BALENCIAGA TRACK',
  size: 42,
  price: '65000',
  discountType: 5,
  hashTags: [['Balenciaga,Кроссовки'], 'Текстиль', 'Люкс'],
}, {
  id: 5,
  company: 'Dr.Martens',
  name: 'Dr.Martens 1461',
  size: 38,
  price: 24000.1244124124124,
  discountType: 5,
  hashTags: undefined,
}];


const formattedSnickers = [];
const problemSnickers = [];

snickers.forEach((snicker) => {
	const price = !snicker.price ? 0 : parseFloat(snicker.price);

	const discountData = discounts.find((discount) => {
		const discountValue = discount[1];
		if (typeof discountValue !== 'number' && discountValue.cond > price) {
			return false;
		} 
		if (discount[0] === snicker.discountType) {
			return true;
		}
	});

	const discountValue = Array.isArray(discountData) ? discountData[1] : 0;

	const numericDiscount = typeof discountValue === 'number'? discountValue : discountValue.value;

  const newSnicker = {
    id: snicker.id,
    size: snicker.size,
    name: snicker.name.trim(),
    finalPrice: parseFloat(price.toFixed(2)) - numericDiscount,
  };

	if (Array.isArray(snicker.hashTags)) {
		newSnicker.hashTags = snicker.hashTags.flat(Infinity).reduce((acc, tag) => {
			if (tag.length === 0) {
				return acc;
			}
			
			const split = tag.split(',');

			split.forEach((item) => {
				acc.push(item);
			});

			return acc;
		}, []);
	} else {
		newSnicker.hashTags = [snicker.company];
	}


	if (newSnicker.finalPrice < 0) {
		const reasons = ['Цена уходит в минус'];
		const snickerWithReasons = {
			...snicker,
			reasons,
		};
		problemSnickers.push(snickerWithReasons);
		return;
	}

	const isDuplicate = formattedSnickers.some((formattedSnicker) => {
		if (newSnicker.name.toLocaleLowerCase() === formattedSnicker.name.toLocaleLowerCase()) {
			return true;
		}
	});

	if (isDuplicate) {
		const reasons = ['Дубликат'];
		const snickerWithReasons = {
			...snicker,
			reasons,
		};
		problemSnickers.push(snickerWithReasons);
	} else {
		formattedSnickers.push(newSnicker);
	}
});

problemSnickers.forEach((snicker) => {
	const name = `Игра ${snicker.name.trim()}`;
	const problems = snicker.reasons.join(', ');
	console.error(`${name} имеет проблемы с данными: ${problems}.`);
});


console.log('Форматированные', formattedSnickers);
console.log('Проблемные', problemSnickers);




const divContainer = document.createElement('div');
divContainer.className = 'container';

formattedSnickers.forEach((snicker) => {
    const snickerContainer = document.createElement('div');
    snickerContainer.className = 'snicker-container';

    const name = createSnickerItem(snicker.name, 'snicker-name');
    snickerContainer.append(name);

    const image = createSnickerImage(`images/${snicker.id}.jpg`, snicker.name.trim(), 'snicker-image');
    snickerContainer.append(image);

    const price = createSnickerItem(`${snicker.finalPrice} ₽`, 'snicker-price');
    snickerContainer.append(price);

    const size = createSnickerItem(`Доступный размер: ${snicker.size}eu`, 'snicker-size');
    snickerContainer.append(size);
    
    if (Array.isArray(snicker.hashTags) && snicker.hashTags.length > 0) {
        const hashTagsContainer = document.createElement('div');
        hashTagsContainer.className = 'snicker-hashtags-container';
    
        snicker.hashTags.forEach((tag) => {
            const hashTag = createSnickerItem(`#${tag}`, 'snicker-hashtag', 'span');
            hashTagsContainer.append(hashTag);
        });
    
        snickerContainer.append(hashTagsContainer);
    }
    

    divContainer.append(snickerContainer);

    divContainer.append(snickerContainer);
});

document.body.prepend(divContainer);

function createSnickerItem(text, className, tagName = 'p') {
    const element = document.createElement(tagName);
    element.innerText = text;
    element.className = className;

    return element;
}

function createSnickerImage(src, alt, className) {
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  image.classList.add(className);
  return image;
}