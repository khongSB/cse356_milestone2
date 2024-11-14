import os
import sys
import subprocess

# Specify the input directory
input_dir = '.'

# Create the FFmpeg command template for adaptive streaming
ffmpeg_command_template = (
    "ffmpeg -y -i \"{input_file}\" "
    "-map 0:v -b:v:0 254k -s:v:0 320x180 -sws_flags lanczos "
    "-map 0:v -b:v:1 507k -s:v:1 320x180 "
    "-map 0:v -b:v:2 759k -s:v:2 480x270 "
    "-map 0:v -b:v:3 1013k -s:v:3 640x360 "
    "-map 0:v -b:v:4 1254k -s:v:4 640x360 "
    "-map 0:v -b:v:5 1883k -s:v:5 768x432 "
    "-map 0:v -b:v:6 3134k -s:v:6 1024x576 "
    "-map 0:v -b:v:7 4952k -s:v:7 1280x720 "
    "-adaptation_sets 'id=0,streams=v' "
    "-init_seg_name '{video_name}-init_$RepresentationID$.m4s' "
    "-media_seg_name '{video_name}-chunk_$Bandwidth$_$Number$.m4s' "
    "-use_template 1 -use_timeline 1 "
    "-vf \"pad=width=max(iw\\,ih*(16/9)):height=ow/(16/9):x=(ow-iw)/2:y=(oh-ih)/2\" "
    "-f dash \"{output_file}\""
)

# Create the FFmpeg command for generating thumbnails
ffmpeg_thumbnail_command = (
    "ffmpeg -y -i {input_file} "
    "-vf \"scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2:black\" "
    "-frames:v 1 {output_file} "
)

# Function to extract the ID from the filename
def extract_id(filename):
    return filename.split('-')[0]

if len(sys.argv) != 2:
    print("Expecting a single file path")
    sys.exit(1)

filename = sys.argv[1]
input_file = os.path.join(input_dir, filename)
video_name = filename.split('.')[0]

# Create output directories for manifests and segments
output_subdir = os.path.join('./processed-media', 'manifests')
segments_dir = os.path.join('./processed-media', 'segments')
os.makedirs(output_subdir, exist_ok=True)
os.makedirs(segments_dir, exist_ok=True)

# Generate the output .mpd file path
output_file = os.path.join(output_subdir, video_name + '.mpd')

# Construct the FFmpeg command for adaptive streaming
ffmpeg_command = ffmpeg_command_template.format(
    input_file=input_file, video_name=video_name, output_file=output_file
)

# Debug output file path
print(f"Processing video: {filename}")
print(f"Output file path: {output_file}")

# Execute the FFmpeg command for adaptive streaming
result = subprocess.run(ffmpeg_command, shell=True)

# Check for errors
if result.returncode != 0:
    print(f"Error processing {filename}: {result.stderr}")

# Create a directory for thumbnails
thumbnail_dir = os.path.join('./processed-media', 'thumbnails')
os.makedirs(thumbnail_dir, exist_ok=True)

# Generate the output path for the thumbnail
thumbnail_output_file = os.path.join(thumbnail_dir, video_name + '.jpg')

# Construct the FFmpeg command for generating a thumbnail
ffmpeg_command = ffmpeg_thumbnail_command.format(
    input_file=input_file, output_file=thumbnail_output_file
)

# Execute the FFmpeg command for thumbnail generation
result = subprocess.run(ffmpeg_command, shell=True)

# Check for errors during thumbnail generation
if result.returncode != 0:
    print(f"Error generating thumbnail for {filename}: {result.stderr}")

print("All videos processed.")

