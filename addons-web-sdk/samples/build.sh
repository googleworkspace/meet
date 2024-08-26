for sample in ./*/
do
    if [ \"$sample\" != \"./dist\/\" ] && [ \"$sample\" != \"./node_modules\/\" ]; then
        cd $sample;
        echo \\n$sample;
        npm run build;
        cd ..;
    fi
done
