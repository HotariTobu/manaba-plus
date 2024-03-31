import argparse
# from glob import glob
import shutil as sh
from pathlib import Path
from PIL import Image

# コマンドライン引数をパースする
parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', default='docs', type=Path, help='input directory path')
parser.add_argument('-o', '--output', default='.temp', type=Path, help='output directory path')
parser.add_argument('-d', '--delete', action='store_true', help='delete the output directory after running')
args = parser.parse_args()

# ディレクトリのパスを設定する
input_dir: Path = args.input
output_dir: Path = args.output

# 出力先のディレクトリがない場合は作成する
output_dir.mkdir(parents=True, exist_ok=True)

# 対応する拡張子
exts = ['.jpg', '.jpeg', '.gif', '.bmp']

# PILで画像をPNG画像に変換する関数
def convert2png(img_path: Path, output_dir: Path):
    try:
        with Image.open(img_path) as img:
            # 出力先のファイルパスを設定する
            output_path = output_dir / (img_path.stem + '.png')

            # 画像をpng形式で保存する
            img.save(output_path, 'PNG')

    except Exception as e:
        print(f"Failed to convert {img_path}: {e}")

# 指定したディレクトリ内のすべての画像ファイルを処理する
# ext_ptr = ','.join(exts)
# pathname = input_dir / f"**/*{{{ext_ptr}}}"
# img_paths = glob(str(pathname), recursive=True)

# 拡張子が対応するものではない場合は処理しない
def iter_dirs(path: Path):
    if path.is_dir():
        for sub_path in path.iterdir():
            yield from iter_dirs(sub_path)
    elif path.suffix in exts:
        yield path

img_paths = iter_dirs(input_dir)
for img_path in img_paths:
    convert2png(img_path, output_dir)

input('Press enter to exit: ')

# 出力先のディレクトリを削除する
if args.delete:
    sh.rmtree(output_dir)
