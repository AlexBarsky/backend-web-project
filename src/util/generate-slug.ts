const transliteration = (str: string): string => {
	const ru =
		'А-а-Б-б-В-в-Г-г-Ґ-ґ-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-I-i-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я'.split(
			'-',
		);
	const en =
		"A-a-B-b-V-v-G-g-D-d-E-e-E-e-Zh-zh-Z-z-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-C-c-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-Yu-yu-Ya-ya".split(
			'-',
		);

	let res = '';
	for (let i = 0, l = str.length; i < l; i++) {
		const s = str.charAt(i),
			n = ru.indexOf(s);

		res += n >= 0 ? en[n] : s;
	}
	return res;
};

export const generateSlug = (str: string): string => {
	let url: string = str.replace(/[\s]+/gi, '-');

	url = transliteration(url);
	url = url
		.replace(/[^0-9a-z_\-]+/gi, '')
		.replace('---', '-')
		.replace('--', '-')
		.toLowerCase();

	return url;
};
