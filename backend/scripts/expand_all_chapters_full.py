import os

def expand_all():
    print("Expanding all chapters to comprehensive 100-130 page academic report...")
    
    # Run write_massive_ch1
    import write_massive_ch1
    write_massive_ch1.write_massive_ch1()
    
    # Run write_ch2
    import write_ch2
    write_ch2.write_ch2()
    
    # Run write_massive_ch3
    import write_massive_ch3
    write_massive_ch3.write_massive_ch3()
    
    # Run write_ch4
    import write_ch4
    write_ch4.write_ch4()
    
    # Run write_ch5_and_bib
    import write_ch5_and_bib
    write_ch5_and_bib.write_ch5_and_bib()
    
    # Run assemble_and_expand
    import assemble_and_expand
    assemble_and_expand.assemble_master()
    
    print("All chapters expanded and master document re-assembled.")

if __name__ == "__main__":
    expand_all()
