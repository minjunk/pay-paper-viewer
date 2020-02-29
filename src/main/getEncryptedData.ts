import cheerio from 'cheerio';

function getEncryptedData(data: string): string {
  const $ = cheerio.load(data);
  return $("input[name*='_viewData']").attr('value');
}

export default getEncryptedData;
