.PHONY: all clean

B=build
SRC=src

JAVA=java
JAVAC=javac

all: $B
	cd $B && $(JAVA) Main

$B: $(SRC)
	$(JAVAC) $^/*.java -d $B

clean:
	rm -rf $B
