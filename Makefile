.PHONY: all clean

B=build
SRC=src

JAVA=java
JAVAC=javac

all: $B test
	cd $B && $(JAVA) Main

test: $B
	test "$$(cd $B && $(JAVA) Main)" = ''

$B: $(SRC)
	$(JAVAC) $^/*.java -d $B

clean:
	rm -rf $B
