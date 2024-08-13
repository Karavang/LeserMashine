import zipfile
from lxml import etree

def epub_info(fname):
    def xpath(element, path):
        return element.xpath(
            path,
            namespaces={
                "n": "urn:oasis:names:tc:opendocument:xmlns:container",
                "pkg": "http://www.idpf.org/2007/opf",
                "dc": "http://purl.org/dc/elements/1.1/",
            },
        )[0]

    try:
        # Подготовка к чтению из .epub-файла
        zip_content = zipfile.ZipFile(fname)

        # Находим файл метаданных (container.xml)
        cfname = xpath(
            etree.fromstring(zip_content.read("META-INF/container.xml")),
            "n:rootfiles/n:rootfile/@full-path",
        )

        # Извлекаем блок метаданных из файла метаданных
        metadata = xpath(
            etree.fromstring(zip_content.read(cfname)),
            "/pkg:package/pkg:metadata",
        )

        # Упаковываем данные в словарь
        result = {
            s: xpath(metadata, f"dc:{s}/text()")
            for s in ("title", "language", "creator", "date", "identifier")
        }

        return result
    except Exception as e:
        print(f"Ошибка при извлечении информации из EPUB: {e}")
        return None

# Пример использования:
if __name__ == "__main__":
    epub_file = "/python/1997 Wieża Jaskółki.epub"  # Замените на фактический путь
    extracted_info = epub_info(epub_file)
    if extracted_info:
        print("Информация из EPUB:", extracted_info)
    else:
        print("Не удалось извлечь информацию из EPUB.")
